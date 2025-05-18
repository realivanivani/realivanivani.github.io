---
title: 'Anomaly Detection in HTTP Requests: A Machine Learning Approach'
date: 2024-07-28
permalink: /posts/2024/07/blog-post-5/
tags:
  - anomaly detection
  - freud detection
  - machine learning
  - http requests
  - unsupervised model
---
A while back, I was given an interesting assignment: build a model to detect anomalous HTTP requests. The goal was to identify malicious web traffic by analyzing patterns in normal and anomalous requests. This led me to explore the **CSIC 2010 dataset**, a well-known benchmark for HTTP anomaly detection.  

In this blog, I’ll walk through my approach—from preprocessing the raw dataset to training a machine learning model—and share key insights along the way.  

---  

## The Dataset: CSIC 2010  

The [CSIC 2010 HTTP dataset](http://www.isi.csic.es/dataset/) contains over **36,000 normal requests** and **25,000+ anomalous requests** (web attacks) targeting an e-commerce application. The data is structured into:  
- **Normal Traffic (Training)**  
- **Normal Traffic (Test)**  
- **Anomalous Traffic (Test)**  

While the dataset is designed for unsupervised learning, I opted for a **supervised approach** by combining normal and anomalous data into a labeled dataset.  

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

I chose a **Random Forest classifier** for its robustness with text data and ability to handle imbalanced datasets:  

```python
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=1000, ngram_range=(1, 2))),
    ('clf', RandomForestClassifier(n_estimators=100, class_weight='balanced'))
])
```  

**Why Random Forest?**  
- Handles non-linear relationships well.  
- Provides feature importance scores (useful for interpreting HTTP attack patterns).  

---  

## Step 4: Evaluation  

The model achieved **79% accuracy** on the test set, with:  
- **High precision on normal traffic (1.00)** → Few false positives.  
- **Lower precision on anomalies (0.55)** → Some attacks were missed.  

**Visualizations:**  
1. **ROC Curve (AUC = 0.86):**  
   - Showed good trade-off between true positives and false positives.  
2. **Confusion Matrix:**  
   - Highlighted misclassified anomalies.  
3. **Feature Importance:**  
   - Revealed key n-grams (e.g., suspicious URL patterns).  

---  

## Key Takeaways  

1. **Parsing is Half the Battle:**  
   - Raw HTTP data requires careful preprocessing. The `parse_http_request` function was the backbone of this project.  
2. **Text-Based Features Work:**  
   - Even simple TF-IDF features captured meaningful patterns in HTTP requests.  
3. **Room for Improvement:**  
   - Adding length-based features (e.g., URL length) or rule-based flags (e.g., detecting SQL keywords) could boost performance.  

---  

## Next Steps  

1. **Advanced Feature Engineering:**  
   - Extract URL parameters, count special characters, or flag rare user agents.  
2. **Model Enhancements:**  
   - Try SVMs or neural networks for comparison.  
3. **Deployment:**  
   - Wrap the model in an API for real-time traffic monitoring.  

---  

### Final Thoughts  

This project was a great dive into **applied anomaly detection**. While the results were promising, the real value came from understanding the nuances of HTTP traffic and the importance of clean data.  

For more details, check out the [full notebook here](https://github.com/realivanivani/net-traffic-classifier/blob/master/notebook/csic-2010-https-attacks-classifier.ipynb).  

**Full notebook:** [GitHub Link](https://github.com/realivanivani/net-traffic-classifier/)  

---  

#MachineLearning #CyberSecurity #AnomalyDetection #DataScience
