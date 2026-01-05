---
title: "Anomaly Detection in HTTP Requests: From Supervised to Unsupervised Learning"
excerpt: "Anomaly detection Supersied and Unsupervised Machine Learning to detect malicious HTTP requests by parsing raw traffic logs, engineering TF-IDF features, and achieving 79% accuracy—highlighting the importance of preprocessing in cybersecurity ML tasks1<br/><img src='/images/http-anomaly-detection.png'>"
collection: portfolio
---
## Background

Detecting malicious HTTP requests is crucial for web security. A while back, I was given an interesting assignment: build a model to detect anomalous HTTP requests. The goal was to identify malicious web traffic by analyzing patterns in normal and anomalous requests. This led me to explore the **CSIC 2010 dataset**, a well-known benchmark for HTTP anomaly detection.  

Even though the first assignment was to apply unsupervised learning, I took a supervised learning approach. However, since the dataset was originally designed for unsupervised learning, I decided to explore that path as well.

In this blog, I’ll walk through both approaches—supervised (Random Forest) and unsupervised (Isolation Forest & Autoencoders)—and compare their performance. 

---   

## The Dataset: CSIC 2010 HTTP dataset

The [CSIC 2010 HTTP dataset](http://www.isi.csic.es/dataset/) contains over **36,000 normal requests** and **25,000+ anomalous requests** (web attacks) targeting an e-commerce application. The data is structured into:  
- **Normal Traffic (Training)**  
- **Normal Traffic (Test)**  
- **Anomalous Traffic (Test)**  

While the dataset is designed for unsupervised learning, I started with a **supervised approach** by combining normal and anomalous data into a labeled dataset.  

### **Key Challenges**  
- **Unsupervised nature**: No labels for training, only normal traffic.  
- **Raw text format**: HTTP logs need parsing into structured features.

---  

## Step 1: Preprocessing the Raw Data  

The most critical (and tedious) step was parsing the raw `.txt` files into a structured format. Here’s how I tackled it:  

### **Key Challenges:**  
- The dataset came as raw HTTP requests in `.txt` files.  
- Requests were split across files labeled by type (`normalTrafficTraining.txt`, `anomalousTrafficTest.txt`, etc.).  
- Each request needed parsing into features like **HTTP method, URL, headers, and body**.  

### **Parsing Workflow:**  
1. **Extract Request Components:**  
   - Split raw text into individual requests using regex (e.g., `GET` or `POST` as delimiters).  
   - Parse each request into structured fields:  
     ```python
     def parse_http_request(request_text):
         # Extract method, URL, headers, etc.
         return {
             'Method': method,
             'URL': url,
             'HTTP_Version': http_version,
             'User-Agent': user_agent,
             'Body': body  # if present
         }
     ```  
2. **Label the Data:**  
   - Filenames indicated whether a request was `Normal` or `Anomalous` and part of `Training` or `Test` sets.  
3. **Combine and Save:**  
   - Merge parsed requests into a DataFrame and save as CSV for training/testing.  

### **Output Files:**  
- `http_requests_all.csv` (all parsed requests).  
- `http_requests_train.csv` (normal training data).  
- `http_requests_test.csv` (normal + anomalous test data).  

---  

## Step 2: Feature Engineering  

Once the data was parsed, I engineered features to help the model distinguish normal from anomalous traffic:  

1. **Combine Text Features:**  
   - Concatenated `Method`, `URL`, `HTTP_Version`, `User-Agent`, and `Body` into a single text feature.  
   - Example:  
     ```python
     df['text'] = df['Method'] + ' ' + df['URL'] + ' ' + df['HTTP_Version'] + ' ' + df['User-Agent']
     ```  
2. **Text Cleaning:**  
   - Lowercased text and removed special characters.  
3. **TF-IDF Vectorization:**  
   - Converted text into numerical features using **TF-IDF with 1-2 word n-grams**.  
   - Limited to the **top 1,000 features** to manage dimensionality.  

---  

## Step 3: Model Training  

## **Approach 1: Supervised Learning (Random Forest)**  

### **Steps**  
1. **Parsed HTTP logs** into structured fields (`Method`, `URL`, `Headers`, `Body`).  
2. **Engineered features** using TF-IDF (1-2 word n-grams).  
3. **Trained a Random Forest** on labeled data (normal vs. anomalous).  

### **Results**  
📊 **79% accuracy**  
✅ **High precision on normal traffic (1.00)**  
⚠️ **Lower precision on anomalies (0.55)**  

**Takeaway:**  
✔️ Works well when labeled data is available.  
❌ Struggles with unseen attack patterns.  

---  

## **Approach 2: Unsupervised Learning**  

Since real-world traffic often lacks anomaly labels, I tried two unsupervised methods:  

### **1. Isolation Forest**  
- **Idea:** Detects anomalies as "easy-to-isolate" outliers.  
- **Implementation:**  
  ```python
  model = Pipeline([
      ('tfidf', TfidfVectorizer(max_features=1000)),
      ('clf', IsolationForest(contamination=0.1))
  ])
  model.fit(normal_training_data)
  ```  
- **Results:**  
  ```
              precision    recall  f1-score   support
      Normal       0.61      0.90      0.73     36000
   Anomalous       0.53      0.17      0.26     24668
  ```  
  ✅ **Catches 90% of normal traffic** (low false alarms).  
  ❌ **Misses 83% of attacks** (low recall).  

### **2. Autoencoder (Deep Learning)**  
- **Idea:** Learns to reconstruct normal traffic; anomalies have high reconstruction error.  
- **Implementation:**  
  ```python
  autoencoder = Model(inputs=input_layer, outputs=decoder)
  autoencoder.compile(optimizer='adam', loss='mse')
  autoencoder.fit(normal_data, normal_data, epochs=10)
  ```  
- **Results:**  
  ```
            precision    recall  f1-score   support
           0       0.65      0.96      0.77     36000
           1       0.80      0.23      0.36     24668
  ```  
  ✅ **Better balanced performance** (66% accuracy vs. 60% for Isolation Forest).  
  ❌ Still **misses many attacks** (only 23% recall).  

---  
## **Key Takeaways**  

| **Metric**       | **Supervised (RF)** | **Unsupervised (IF)** | **Unsupervised (AE)** |
|------------------|---------------------|-----------------------|-----------------------|
| **Accuracy**     | 79%                 | 60%                   | 66%                   |
| **Anomaly Recall** | 71% (F1)           | 17%                   | 23%                   |
| **Normal Recall** | 72%                | 90%                   | 96%                   |

### **Insights**  
1. **Parsing is Half the Battle:**  
   - Raw HTTP data requires careful preprocessing. The `parse_http_request` function was the backbone of this project.  
2. **Text-Based Features Work:**  
   - Even simple TF-IDF features captured meaningful patterns in HTTP requests.  
3. **Room for Improvement:**  
   - Adding length-based features (e.g., URL length) or rule-based flags (e.g., detecting SQL keywords) could boost performance.
     
✔️ **Supervised learning wins when labels exist**—better at catching attacks.  
✔️ **Unsupervised is realistic for production** (no need for labeled attacks).  
⚠️ **Hybrid approach may be best**:  
   - Use unsupervised for baseline filtering.  
   - Add rules/SVM for known attack patterns.  

---  

### Final Thoughts  

This project was a great dive into **applied anomaly detection**. While the results were promising, the real value came from understanding the nuances of HTTP traffic and the importance of clean data.  

For more details, check out the [full notebook here](https://github.com/realivanivani/net-traffic-classifier/blob/master/notebook/csic-2010-https-attacks-classifier.ipynb).  

**Full notebook:** [GitHub Link](https://github.com/realivanivani/net-traffic-classifier/)  

---  

#MachineLearning #CyberSecurity #AnomalyDetection #DataScience
