---
title: 'An easy to implement AI voice and video assistant with Livekit'
date: 2025-01-29
permalink: /posts/2025/01/blog-post-7/
tags:
  - AI agent
  - Livekit
  - voice assistant
  - LLM
---

Implementing AI Voice and Video Agents with Livekit: A Straightforward Approach

In this blog post, we will discuss the implementation of AI-powered voice and video agents using the Livekit platform.  Our experience demonstrates that setting up these agents is a straightforward process, especially with the comprehensive documentation and tutorials available on the Livekit website. We have successfully implemented two versions of these agents: one focused solely on voice interaction and another that incorporates both voice and visual assistance.

My initial implementation involved creating a voice-only agent, directly following the instructions and examples provided in the Livekit documentation. This process was indeed simple, thanks to the clear and well-structured guides available.  Building upon this foundation, we then explored creating a more advanced agent capable of both voice and visual interaction.  For this, we utilized a readily available tutorial, which expanded on the basic voice agent to include visual capabilities.

To interact with these agents, we utilized the Livekit Playground. This web-based interface provides a user-friendly environment for testing and interacting with Livekit agents, making the development and experimentation process significantly smoother.

This work is built upon the foundation laid by Livekit's own tutorials, and draws inspiration from online resources such as the YouTube tutorial by Damiano Redemagni and Underfitted.  For those interested in exploring further, the Livekit GitHub repository offers a wealth of details, examples, and various agent implementations.

For the code, please take a look at github [repository](https://github.com/realivanivani/realtime-assistant-livekit)

To replicate our setup and run these agents, the following steps are necessary:

**Setup Instructions:**

1.  **Create a Virtual Environment:** This isolates the project's dependencies.
    ```bash
    python3 -m venv .venv
    ```

2.  **Activate the Virtual Environment:** This ensures you are working within the isolated environment.
    ```bash
    source .venv/bin/activate
    ```

3.  **Update pip:** Ensure you have the latest version of pip, the package installer for Python.
    ```bash
    pip install -U pip
    ```

4.  **Install Required Packages:** Install all necessary Python libraries listed in the `requirements.txt` file.
    ```bash
    pip install -r requirements.txt
    ```

5.  **Set Environment Variables:**  These variables are crucial for authentication and API access. You will need to obtain these credentials from your Livekit account and OpenAI.
    ```bash
    LIVEKIT_URL="wss://..." # Your Livekit URL
    LIVEKIT_API_SECRET="..." # Your Livekit API Secret
    LIVEKIT_API_KEY="..." # Your Livekit API Key
    OPENAI_API_KEY="..." # Your OpenAI API Key
    ```

6.  **Run the Agent Code:** Choose between `agent_vision.py` (voice and visual agent) or `agent_voice.py` (voice-only agent). First, download necessary files:
    ```bash
    python3 agent.py download-files
    ```
    Then, start the agent:
    ```bash
    python3 agent.py start
    ```

7.  **Access the Playground:** Open the Livekit Agents Playground in your web browser to interact with the agent.
    ```
    https://agents-playground.livekit.io/
    ```

**Understanding Key Components:**

The provided Python code utilizes two important libraries: `asyncio` and `dotenv`.

*   **asyncio:** This is a Python library for writing concurrent code using coroutines. In the context of our agents, `asyncio` is essential for managing multiple tasks concurrently, such as handling voice input, processing visual data (in the vision agent), communicating with the Livekit server, and generating agent responses.  The `async` and `await` keywords in the code are part of the `asyncio` framework, enabling the agent to perform tasks without blocking the main program flow, ensuring responsiveness and efficiency.

*   **dotenv:** This library simplifies the management of environment variables.  Sensitive information like API keys and Livekit credentials should not be hardcoded directly into the script. `dotenv` allows you to store these variables in a `.env` file, which is then loaded by the script using `load_dotenv()`. This practice enhances security and makes configuration more manageable, especially when deploying or sharing code.

**Code Example (Voice and Visual Agent - `agent_vision.py`):**

```python
import asyncio
from typing import Annotated

from dotenv import load_dotenv
from livekit import agents, rtc
from livekit.agents import JobContext, WorkerOptions, cli, tokenize, tts
from livekit.agents.llm import ChatContext, ChatImage, ChatMessage
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import deepgram, openai, silero

load_dotenv()
class AssistantFunction(agents.llm.FunctionContext):
    """This class is used to define functions that will be called by the assistant."""

    @agents.llm.ai_callable(
        description=(
            "Called when asked to evaluate something that would require vision capabilities,"
            "for example, an image, video, or the webcam feed."
        )
    )
    async def image(
        self,
        user_msg: Annotated[
            str,
            agents.llm.TypeInfo(
                description="The user message that triggered this function"
            ),
        ],
    ):
        print(f"Message triggering vision capabilities: {user_msg}")
        return None


async def get_video_track(room: rtc.Room):
    """Get the first video track from the room. We'll use this track to process images."""

    video_track = asyncio.Future[rtc.RemoteVideoTrack]()

    for _, participant in room.remote_participants.items():
        for _, track_publication in participant.track_publications.items():
            if track_publication.track is not None and isinstance(
                track_publication.track, rtc.RemoteVideoTrack
            ):
                video_track.set_result(track_publication.track)
                print(f"Using video track {track_publication.track.sid}")
                break

    return await video_track


async def entrypoint(ctx: JobContext):
    await ctx.connect()
    print(f"Room name: {ctx.room.name}")

    chat_context = ChatContext(
        messages=[
            ChatMessage(
                role="system",
                content=(
                    "Your name is Alloy. You are a funny, witty bot. Your interface with users will be voice and vision."
                    "Respond with short and concise answers. Avoid using unpronouncable punctuation or emojis."
                ),
            )
        ]
    )

    gpt = openai.LLM(model="gpt-4o mini")

    # Since OpenAI does not support streaming TTS, we'll use it with a StreamAdapter
    # to make it compatible with the VoiceAssistant
    openai_tts = tts.StreamAdapter(
        tts=openai.TTS(voice="alloy"),
        sentence_tokenizer=tokenize.basic.SentenceTokenizer(),
    )

    latest_image: rtc.VideoFrame | None = None

    assistant = VoiceAssistant(
        vad=silero.VAD.load(),  # We'll use Silero's Voice Activity Detector (VAD)
        stt=deepgram.STT(),  # We'll use Deepgram's Speech To Text (STT)
        llm=gpt,
        tts=openai_tts,  # We'll use OpenAI's Text To Speech (TTS)
        fnc_ctx=AssistantFunction(),
        chat_ctx=chat_context,
    )

    chat = rtc.ChatManager(ctx.room)

    async def _answer(text: str, use_image: bool = False):
        """
        Answer the user's message with the given text and optionally the latest
        image captured from the video track.
        """
        content: list[str | ChatImage] = [text]
        if use_image and latest_image:
            content.append(ChatImage(image=latest_image))

        chat_context.messages.append(ChatMessage(role="user", content=content))

        stream = gpt.chat(chat_ctx=chat_context)
        await assistant.say(stream, allow_interruptions=True)

    @chat.on("message_received")
    def on_message_received(msg: rtc.ChatMessage):
        """This event triggers whenever we get a new message from the user."""

        if msg.message:
            asyncio.create_task(_answer(msg.message, use_image=False))

    @assistant.on("function_calls_finished")
    def on_function_calls_finished(called_functions: list[agents.llm.CalledFunction]):
        """This event triggers when an assistant's function call completes."""

        if len(called_functions) == 0:
            return

        user_msg = called_functions[0].call_info.arguments.get("user_msg")
        if user_msg:
            asyncio.create_task(_answer(user_msg, use_image=True))

    assistant.start(ctx.room)

    await asyncio.sleep(1)
    await assistant.say("Hi there! How can I help?", allow_interruptions=True)

    while ctx.room.connection_state == rtc.ConnectionState.CONN_CONNECTED:
        video_track = await get_video_track(ctx.room)

        async for event in rtc.VideoStream(video_track):
            # We'll continually grab the latest image from the video track
            # and store it in a variable.
            latest_image = event.frame


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

This code defines an AI assistant named "Alloy" that can interact with users through voice and vision. It uses various Livekit components and plugins like Voice Activity Detection (VAD), Speech-to-Text (STT), Text-to-Speech (TTS), and a Large Language Model (LLM) from OpenAI. The agent can receive voice messages, process visual input from a video track, and respond using voice.

In conclusion, implementing AI voice and video agents with Livekit is a remarkably accessible process, especially when leveraging the provided documentation and tools.  We encourage you to explore the Livekit platform and its resources to build your own interactive AI agents.

