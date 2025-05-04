---
title: 'Building a Siamese CNN for Fingerprint Recognition: A Journey from Concept to Implementation'
date: 2025-01-31
permalink: /posts/2025/01/blog-post-8/
tags:
  - CNN
  - fingerprint
  - recognition
  - ML
  - Siamese CNN
---

The idea for this project stemmed from a collaboration with my friend Jovan on his Bachelor's thesis. His concept was to use a **Siamese Convolutional Neural Network (Siamese CNN)** for fingerprint recognition, structured as follows:
This blog outlines how we implemented this in Python & Keras, while dealing with dataset augmentation, Siamese architecture, and model validation. You can explore the project's [Git repo](https://github.com/realivanivani/fingerprint-recognition).

1. **Two parallel CNN branches** (with shared weights) extract feature representations from input fingerprint images.
2. **Feature subtraction** is applied to compare the extracted features.
3. **A final convolutional + pooling layer** processes the difference.
4. **A sigmoid layer** classifies whether the fingerprints match.

This blog details the step-by-step implementation of this idea, covering dataset preparation, augmentation, model architecture, training, and evaluation.

![image](https://github.com/user-attachments/assets/3abe2533-a104-471a-88cb-dea369745831)

---

## **Dataset Preparation**

Our dataset consists of four subsets:

* **Real** (original fingerprints)
* **Easy**, **Medium**, and **Hard** (distorted fingerprints with increasing complexity)

### **Loading the Dataset**

We use NumPy to load the dataset, which contains images and corresponding labels:

```python
def load_dataset():
    datasets = ['real', 'easy', 'medium', 'hard']
    data_dict = {}
    for dataset in datasets:
        x_data = np.load(f'dataset/x_{dataset}.npy')
        y_data = np.load(f'dataset/y_{dataset}.npy')
        data_dict[dataset] = (x_data, y_data)
        print(f"{dataset}: X shape {x_data.shape}, Y shape {y_data.shape}")
    return data_dict

data_dict = load_dataset()
```

### **Data Visualization**

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

### **Train-Test Split**

We combine `easy`, `medium`, and `hard` subsets to create a training set and reserve 10% for validation:

```python
x_data = np.concatenate([data_dict['easy'][0], data_dict['medium'][0], data_dict['hard'][0]], axis=0)
label_data = np.concatenate([data_dict['easy'][1], data_dict['medium'][1], data_dict['hard'][1]], axis=0)

x_train, x_val, label_train, label_val = train_test_split(x_data, label_data, test_size=0.1)
```

---

## **Data Augmentation**

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

---

## **Data Generator**

Since the dataset is large, we use a **custom Keras DataGenerator** to load images in batches during training.

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

---

## **Model Architecture**

We implement **Jovan’s Siamese CNN**:

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

---

## **Training**

```python
history = model.fit(train_gen, epochs=15, validation_data=val_gen)
```

---

## **Model Evaluation**

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

### **Results Summary**

* **Precision:** 1.00 for matching fingerprints.
* **Recall:** 0.73 for matching fingerprints (improvement needed).
* **Overall Accuracy:** 86%.
* **ROC AUC:** 1.00 (near-perfect classification).

---

## **Conclusion**

This project successfully implemented a **Siamese CNN for fingerprint recognition**. Future improvements include **class-balanced loss functions**, **adversarial training**, and **threshold tuning** to enhance recall. Jovan’s idea has great potential for real-world security applications! 🚀
