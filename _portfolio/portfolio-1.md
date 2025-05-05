---
title: "Fingerprint Verification System Using a Siamese Neural Network in Keras"
excerpt: "CNN Siamese model for fingerprint recognition using Python & Keras, while dealing with dataset augmentation, Siamese architecture, and model validation1<br/><img src='/images/440195189-90aeea1b-0aea-4506-b037-261aeeebc1e6.png'>"
collection: portfolio
---
## Background

Biometric authentication, particularly fingerprint recognition, remains one of the most trusted and widely deployed forms of identity verification. However, traditional classification methods may not generalize well when facing altered or partially deformed fingerprints. We'll walk through the development of a deep learning-based verification pipeline using a **Siamese Neural Network**. Our dataset includes real and synthetically altered fingerprint images, and our goal is to train a model that can determine whether two fingerprint images belong to the same individual. This blog outlines how we implemented this in Python & Keras, while dealing with dataset augmentation, Siamese architecture, and model validation. You can explore the project's [Git repo](https://github.com/realivanivani/fingerprint-recognition) where you can also find the [Jupyter Notebooks](https://github.com/realivanivani/fingerprint-recognition/blob/main/notebooks/).

We will explore the following:

* Preprocessing and label extraction from fingerprint image filenames
* Augmentation strategies for robustness
* Data generation for training on pairwise data
* Architecture and training of a Siamese neural network

![image](https://github.com/user-attachments/assets/3abe2533-a104-471a-88cb-dea369745831)

---

## Step 1: Dataset and Label Extraction

Our fingerprint dataset follows a strict naming convention. For instance:

```
001__M_Left_index_SWarp.BMP
```

From this, we extract four key labels:

* **Subject ID** (001)
* **Gender** (M = 0, F = 1)
* **Hand** (Left = 0, Right = 1)
* **Finger type** (Index = 1)

We implemented this parsing logic in the `extract_label` function:

```python
def extract_label(img_path):
    ...
    gender = 0 if gender_str == 'M' else 1
    hand = 0 if hand_str == 'Left' else 1
    finger_map = {'thumb': 0, 'index': 1, 'middle': 2, 'ring': 3, 'little': 4}
    ...
```

We load and preprocess all `Altered-Easy` images by resizing them to 90x90 pixels and saving both the image arrays and label arrays:

```python
images = np.empty((num_images, 90, 90), dtype=np.uint8)
labels = np.empty((num_images, 4), dtype=np.uint16)
...
images[i] = cv2.resize(image, target_size)
labels[i] = extract_label_alt(image_path)
```

---

## Step 2: Dataset Loading and Visualization

Using `np.load`, we import four subsets: `real`, `easy`, `medium`, and `hard`, and confirm their shapes. Each subset is visualized to verify the integrity of image-label pairs.

A quick visualization ensures that images are loaded correctly:

```python
def visualize_samples(data_dict):
    plt.figure(figsize=(15, 10))
    for idx, (key, (x, y)) in enumerate(data_dict.items(), start=1):
        plt.subplot(1, 4, idx)
        plt.title(y[0])
        plt.imshow(x[0].squeeze(), cmap='gray')
    plt.show()

visualize_samples(data_dict)
```

This step is crucial for verifying preprocessing correctness, especially when dealing with a custom dataset.

### Train-Test Split

We combine `easy`, `medium`, and `hard` subsets to create a training set and reserve 10% for validation:

```python
x_data = np.concatenate([data_dict['easy'][0], data_dict['medium'][0], data_dict['hard'][0]], axis=0)
label_data = np.concatenate([data_dict['easy'][1], data_dict['medium'][1], data_dict['hard'][1]], axis=0)

x_train, x_val, label_train, label_val = train_test_split(x_data, label_data, test_size=0.1)
```

---

## Step 3: Data Augmentation

To improve model generalization, we apply spatial transformations using the `imgaug` library. These include:

* Gaussian blur
* Rotation (±30 degrees)
* Random translation and scaling


Since `imgaug` is not compatible with NumPy 2.x, we downgraded NumPy:

```bash
pip install "numpy<2.0"
```

We use **image augmentation** to improve model generalization:

```python
import imgaug.augmenters as iaa

def preview_augmentation(images):
    seq = iaa.Sequential([
        iaa.GaussianBlur(sigma=(0, 0.5)),
        iaa.Affine(
            scale={"x": (0.9, 1.1), "y": (0.9, 1.1)},
            translate_percent={"x": (-0.1, 0.1), "y": (-0.1, 0.1)},
            rotate=(-30, 30),
            order=[0, 1],
            cval=255
        )
    ], random_order=True)

    augmented_images = seq.augment_images(images)
    
    plt.figure(figsize=(16, 6))
    for i, aug in enumerate(augmented_images):
        plt.subplot(2, 5, i + 1)
        plt.imshow(aug.squeeze(), cmap='gray')
    plt.show()

preview_augmentation([x_data[40000]] * 9)
```

We preview augmentations to ensure that variations are realistic and preserve fingerprint features.

---

## Step 4: Siamese Data Generator

Siamese networks require pairs of inputs:

* **Positive pairs**: same identity (label = 1)
* **Negative pairs**: different identities (label = 0)

Since the dataset is large, we created a custom Keras `DataGenerator` that samples image pairs using label dictionary lookups. Half of the batch contains matching pairs, while the rest contains mismatched pairs.

```python
class DataGenerator(keras.utils.Sequence):
    def __init__(self, x, label, x_real, label_real_dict, batch_size=32, shuffle=True):
        self.x = x
        self.label = label
        self.x_real = x_real
        self.label_real_dict = label_real_dict
        self.batch_size = batch_size
        self.shuffle = shuffle
        self.on_epoch_end()

    def __getitem__(self, index):
        x1_batch = self.x[index * self.batch_size:(index + 1) * self.batch_size]
        label_batch = self.label[index * self.batch_size:(index + 1) * self.batch_size]

        x2_batch = np.empty((self.batch_size, 90, 90, 1), dtype=np.float32)
        y_batch = np.zeros((self.batch_size, 1), dtype=np.float32)

        for i, l in enumerate(label_batch):
            match_key = ''.join(l.astype(str)).zfill(6)
            if random.random() > 0.5:
                x2_batch[i] = self.x_real[self.label_real_dict[match_key]][..., np.newaxis]
                y_batch[i] = 1.
            else:
                while True:
                    unmatch_key, unmatch_idx = random.choice(list(self.label_real_dict.items()))
                    if unmatch_key != match_key:
                        x2_batch[i] = self.x_real[unmatch_idx][..., np.newaxis]
                        break
                y_batch[i] = 0.

        return [x1_batch.astype(np.float32) / 255., x2_batch.astype(np.float32) / 255.], y_batch

train_gen = DataGenerator(x_train, label_train, data_dict['real'][0], label_real_dict, shuffle=True)
val_gen = DataGenerator(x_val, label_val, data_dict['real'][0], label_real_dict, shuffle=False)
```

This strategy balances the training dataset and ensures that the model learns from both types of comparisons.

---

## Step 5: Siamese Network Architecture

The core model consists of **twin convolutional networks** with shared weights that extract features from two input images. The absolute difference of their feature embeddings is passed through a dense layer and finally a sigmoid output:

### Architecture Highlights:

* Twin CNNs: Two Conv2D + MaxPooling layers
* Shared weights for efficient learning
* Dense layers post-subtraction for decision making
* Output: Sigmoid probability of match (1) or mismatch (0)
  
![image](https://github.com/user-attachments/assets/88834915-4b61-4e11-b767-08054ed02abc)

```python
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Subtract
from tensorflow.keras.models import Model

def create_base_network(input_shape):
    input = Input(shape=input_shape)
    x = Conv2D(32, (3, 3), activation='relu', padding='same')(input)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Conv2D(64, (3, 3), activation='relu', padding='same')(x)
    x = MaxPooling2D(pool_size=(2, 2))(x)
    x = Flatten()(x)
    return Model(input, x)

input_shape = (90, 90, 1)
base_network = create_base_network(input_shape)

input_a = Input(shape=input_shape)
input_b = Input(shape=input_shape)

processed_a = base_network(input_a)
processed_b = base_network(input_b)

subtracted = Subtract()([processed_a, processed_b])
x = Dense(128, activation='relu')(subtracted)
output = Dense(1, activation='sigmoid')(x)

model = Model(inputs=[input_a, input_b], outputs=output)
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
model.summary()
```

The final model is trained with `binary_crossentropy` loss and an `Adam` optimizer:

```python
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
```


---

## Step 6: Model Training

Using `model.fit()` with `train_gen` and `val_gen`, we train the network for 15 epochs. Because we use a generator, memory overhead is minimal, and data augmentation is seamlessly integrated.

```python
history = model.fit(train_gen, epochs=15, validation_data=val_gen)
```

Training is monitored using accuracy and binary cross-entropy loss.

---

## Step 7: Evaluation on Unseen Data

Finally, we test the model by pairing a randomly selected distorted validation image with:

1. A matched real image (same subject/hand/finger)
2. An unmatched real image (different identity)

The model predicts similarity probabilities for both.

```python
pred_matched = model.predict([random_img, matched_img])[0][0]
pred_unmatched = model.predict([random_img, unmatched_img])[0][0]
```

![image](https://github.com/user-attachments/assets/90aeea1b-0aea-4506-b037-261aeeebc1e6)

We visualize model performance using **Confusion Matrix**, **Precision-Recall Curve**, and **ROC Curve**.

```python
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

y_pred_labels = model.predict(val_gen) > 0.5
cm = confusion_matrix(y_true, y_pred_labels)

sns.heatmap(cm, annot=True, fmt='d', cmap='viridis')
plt.show()

print(classification_report(y_true, y_pred_labels))
```

![image](https://github.com/user-attachments/assets/fa269629-d427-44cf-9bc4-213c7d50e5f7)


## ✅ **Results & Observations**

* **Precision:** 1.00 for matching fingerprints.
* **Recall:** 0.68 for matching fingerprints (improvement needed).
* **Overall Accuracy:** 84%.
* **ROC AUC:** 1.00 (near-perfect classification).

## Observations

* The model performs well across a variety of synthetic deformations.
* Siamese networks show strong generalization in **one-shot or few-shot** scenarios.
* Image-level pairing combined with metadata lookup offers a flexible way to manage supervised contrastive learning.

---

## ⚠️ **Known Constraints**

* The pipeline depends on `imgaug`, which currently requires **NumPy < 2.0** due to compatibility issues.
* Label extraction assumes a strict filename pattern.

To avoid runtime errors:

```bash
pip install numpy<2.0
```

---

## 🚀 **Conclusion**

This fingerprint verification pipeline leverages the power of **Siamese networks** for image similarity detection. Through careful preprocessing, data augmentation, and label management, we build a robust model capable of biometric verification under challenging conditions.

This approach can be extended to:

* Face or iris verification
* Signature comparison
* Duplicate detection in document datasets

---

## Further Reading & Resources

* [Koch et al., 2015 – Siamese Neural Networks for One-shot Image Recognition](https://www.cs.cmu.edu/~rsalakhu/papers/oneshot1.pdf)
* [imgaug](https://github.com/aleju/imgaug)
* [Keras Functional API](https://keras.io/guides/functional_api/)
* [SOCOFing Fingerprint Dataset](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/QLCFR9)

