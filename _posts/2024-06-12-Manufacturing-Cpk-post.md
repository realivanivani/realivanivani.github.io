---
title: 'Analyzing Manufacturing Data - Cpk and Six Sigma'
date: 2024-06-12
permalink: /posts/2024/06/blog-post-1/
tags:
  - manufacturing
  - Quality Control
  - PySPC
  - Cpk
  - Ppk
  - Six Sigma
---

I've been working in Automotive manufacturing for more then a year now and there is one concept that is holy grail in this industry, and that is **Six Sigma**. It's a methodology for achieving near-perfect quality in manufacturing. But how can you could leverage Six Sigma tools right from your Python environment? That's where the manufacturing package comes in.

In this blog post, I will cover some of the key concepts of quality control in a large scale manufacturing, as well as, tools and Python packages for analyzing it.

## 0. Notebook

For practical implementation of the principles below, please take look at the notebook that I created here: https://github.com/realivanivani/blog-posts/blob/main/Manufacturing_Py.ipynb

## 1. Intro

The modern factory floor generates a deluge of data, from sensor readings to production logs.  Python offers a robust ecosystem of libraries to harness this data for improved efficiency and quality control. Analyzing process data allows for the identification of trends, anomalies, and potential quality issues, enabling proactive quality control measures.  Furthermore, production data analysis reveals bottlenecks, allowing for optimized scheduling and maximized efficiency. These libraries, akin to specialized software modules, empower sophisticated data manipulation and analysis.

Core libraries like Pandas excel at wrangling tabular data, the lifeblood of manufacturing records.  Pandas allows for data cleaning, transformation, and analysis, forming the bedrock of most data workflows.  NumPy, the workhorse for numerical computations, underpins many libraries and provides efficient data structures for large datasets.  SciPy, building on NumPy's foundation, offers a broader suite of scientific and engineering functions frequently employed in manufacturing analysis.

By mastering these tools, manufacturers can transform raw data into actionable insights, driving data-driven decision making and achieving operational excellence.

But, before going into ways how to process manufacturing data one should first understanding its' core concepts like CpK, PpK and Six Sigma Standards.

## 2. What are Cp, Cpk, Pp, and Ppk?

In the world of quality control and process improvement, Cp, Cpk, Pp, and Ppk are essential metrics used to assess process capability and performance. These statistical tools help businesses understand how well their processes are meeting customer requirements.

CpK, or the Process Capability Index, is a statistical measure that shows how well a process is performing relative to its specification limits, or how well a process meets customer specifications. Developed in the 1980s, it considers both the spread of a process's outputs and how centered it is within the acceptable range. A higher Cpk indicates a more capable process with fewer defects. Values below 1 suggest frequent production of out-of-specification items, while those above 1.33 signal a highly capable process. 

PpK, aka Process Performance Index, measures how much a process varies overall and how well it can consistently match the requirements for a given good or service. To ascertain process capacity, the spread of the process distribution is compared to the specification limitations.

![image](https://github.com/user-attachments/assets/0f5c1210-a962-4a60-b28b-28ee02b14a6c)

*Fig1. Illustrative example of what **Cp** and **Cpk** would represent as function of aiming. Cp is equivalent to Precision, thus narrow spread would produce high values of Cp, while Cpk is function of both Precision and Accuracy, meaning that high value sof Cpk represent a low spread and high centering of the distribution*

**How are they used?**
* **Cp and Cpk** are used to evaluate a process that is in a state of statistical control. They help determine if the process is capable of meeting customer requirements.
* **Pp and Ppk** are used to assess the overall performance of a process, regardless of its state of control. They are often used to analyze historical data or when initial process data is being collected.

**Key Differences**
While Cpk only measures process centering relative to specifications, PpK measures both centering and variation. Key differences are:
* **Cp and Pp** focus on process variation, while **Cpk and Ppk** consider both variation and centering.
* **Cp and Cpk** are used for processes in statistical control, while **Pp and Ppk** can be used for any process.
* Cpk assumes overall process variability is constant while PpK does not

**In summary**, 
* Cpk is the potential of a process to meet a specification (short term) while Ppk is how the process actually did (long term). Another way to look at the difference is that **Cpk is used for a subgroup of data, while Ppk is used for the whole process**.

* Cp, Cpk, Pp, and Ppk are valuable tools for understanding and improving process performance. By using these metrics, businesses can identify areas for improvement, reduce defects, and increase customer satisfaction. Learn more about Cpk and PpK at [Six Sigma Study Guide](sixsigmastudyguide.com).

### 2.1 Formulas for Cp, Cpk, Pp, and Ppk

In order to implement these indicators in python, we need to know how are they calculated. Before we dive into the formulas, let's difine some key terms:
- $$\text{USL}$$ is the upper specification limit.
- $$\text{LSL}$$ is the lower specification limit.
- $$\mu$$ is the process mean.
- $$\sigma$$ is the process standard deviation.


#### Process Capability Indices (Cp and Cpk)
* **Cp** (Process Capability Index): Measures the potential capability of a process, assuming the process is centered.
  
   $$Cp = \frac{\text{USL} - \text{LSL}}{6\sigma}$$

* **Cpk** (Process Capability Index): Considers both process variation and centering.
  
   $$Cpk = \min \left( \frac{\text{USL} - \mu}{3\sigma}, \frac{\mu - \text{LSL}}{3\sigma} \right)$$


#### Process Performance Indices (Pp and Ppk)
* **Pp** (Process Performance Index): Measures the actual performance of a process without considering centering.
   
   $$Pp = \frac{\text{USL} - \text{LSL}}{6\sigma*}$$

where σ* is the sample standard deviation.
* **Ppk** (Process Performance Index): Considers both actual performance and process centering.
   
   $$Ppk = \min \left( \frac{\text{USL} - \mu}{3\sigma*}, \frac{\mu - \text{LSL}}{3\sigma*} \right)$$

where σ* is the sample standard deviation.

**Note:** You might notice that the formulas for CpK and PpK are almost the same. The only difference lies in the denominator for the Upper and Lower statistics: Cpk is calculated using the WITHIN standard deviation, while Ppk uses the OVERALL standard deviation. Without boring you with the details surrounding the formulas for the standard deviations, think of the within standard deviation as the average of the subgroup standard deviations, while the overall standard deviation represents the variation of all the data. 
Transfering it to numpy functions, `numpy.std(data)` calculates the sample standard deviation, while for the population standard deviation, you need to set the ddof (delta degrees of freedom) parameter to 0 (`numpy.std(data, ddof=0)`)

### 2.2 Interpreting Cpk and Ppk Values

In short, it is well known that a higher CpK or PpK values indicates a more capable process. **Values below 1 suggest frequent production of out-of-specification items, while those above 1.33 signal a highly capable process.** But let's understand the general scale:

* **Cpk and Ppk values are < 1.0:** The process is not capable of meeting the specifications consistently. There's a high probability of producing defective items.
* **Cpk and Ppk values are 1.33 < > 1.0:** The process is capable of meeting the specifications, but it's operating at a borderline level. Improvements are often necessary.
* **Cpk and Ppk values are 1.67 < > 1.33:** The process is moderately capable, but there's still room for improvement.
* **Cpk and Ppk values are > 1.67:** The process is highly capable and consistently meets specifications.

### Comparing Cpk and Ppk
* **Cpk** reflects the process's potential capability assuming the process is centered.
* **Ppk** reflects the actual process performance, considering both variation and centering.

  Therefore:
* **If Cpk is significantly higher than Ppk:** The process is capable but not centered. Focusing on process centering can improve performance.
* **If Cpk is similar to Ppk:** The process is relatively stable and centered. Further improvements might require reducing process variation.
* **If Ppk is significantly higher than Cpk:** This might indicate a short-term improvement or an outlier in the data. Further investigation is needed.

**Additional Considerations**
* **Combining Cpk and Pp:** Analyzing both values can provide insights into process stability and potential. A high Cp and low Cpk indicate a capable process that's not centered.
* **Long-term vs. Short-term Performance:** Ppk is often used for short-term analysis, while Cpk is more suitable for long-term assessment.
* **Process Stability:** Cpk assumes the process is in statistical control. If the process is unstable, Cpk might be misleading.


![image](https://github.com/user-attachments/assets/cc4a9514-7de8-4cce-a460-ec1302da6d12)

*Fig2. **Cp** and **Cpk** for a case of driver's aiming. This illustration could represent **Pp** and **Ppk** too, just in that case cars would be of different variants*

### Visual Representation
A visual representation can often be more intuitive than just numbers. Control charts, histograms, and capability histograms can provide valuable insights into process behavior and performance. That is the added value 

**Remember:** While numerical values provide a quantitative measure, it's essential to combine them with visual analysis and process knowledge for a comprehensive understanding.


## 3. What is Six Sigma?

Six Sigma is a data-driven quality improvement methodology that strives for near perfection. Developed by Motorola in the 1980s, it focuses on minimizing defects and variation in any process. It uses a set of statistical tools like Cpk to identify and eliminate the root causes of errors. **A Six Sigma process aims for only 3.4 defects per million opportunities (DPMO), signifying exceptional quality.** Six Sigma certifications demonstrate expertise in this methodology. You can find more details on Six Sigma principles at [Six Sigma.us](sixsigma.us). 

- **Six Sigma Standard**: Refers to a process that produces output within ±6 standard deviations (sigma) from the mean, resulting in a very low defect rate.
- **Defects Per Million Opportunities (DPMO)**: At Six Sigma level, the process produces only 3.4 defects per million opportunities.

* **Sigma Level:** Indicates how many standard deviations a process falls within its specification limits.
* **5 Sigma:** Exceptionally high quality with around 233 DPMO (0.023% defect rate).
* **4 Sigma:** Very good quality with roughly 6,210 DPMO (0.02% defect rate).
* **3 Sigma:** Considered an industry standard with approximately 66,807 DPMO (0.7% defect rate).

So, while a 4 sigma process has a defect rate roughly 27 times higher than a 5 sigma process, they both represent a significant reduction in defects compared to a 3 sigma process.

#### Benefits of Six Sigma

- **Improved Quality**: Reduces defects and improves product quality.
- **Cost Savings**: Minimizes waste and reduces costs associated with defects.
- **Customer Satisfaction**: Enhances customer satisfaction by consistently meeting or exceeding expectations.


## 4. `manufacturing` Python Package

Now that we understand key concepts of quality control in manufacturing, let's take a look at the Python `manufacturing` Package

### Key Features

This nifty package brings the power of Six Sigma to your fingertips.  Need to calculate a key metric like Cpk? The manufacturing package has you covered. Cpk helps you assess how well your process meets customer specifications, ensuring you're producing high-quality goods.

But the manufacturing package isn't a one-trick pony. It also offers tools for calculating other Six Sigma metrics, making it a valuable asset for any data-driven manufacturer. Whether you're a seasoned Six Sigma expert or just starting your quality control journey, this package can streamline your workflow and empower you to make data-driven decisions.

1. **Control Charts**: These are used to monitor the stability of manufacturing processes over time. The package supports various types of control charts, including:
   - **X-bar and R charts**: For monitoring the mean and range of a process.
   - **P charts**: For monitoring the proportion of defective items in a process.
   - **C charts**: For monitoring the count of defects per unit.

2. **Process Capability Indices**: These indices measure how well a process can produce output within specified limits. The package includes functions to calculate:
   - **Cp and Cpk**: Indices that measure a process's capability and its centering within specification limits.
   - **Pp and Ppk**: Similar to Cp and Cpk but used for overall process performance.

3. **Data Analysis Tools**: The package provides tools for:
   - **Descriptive statistics**: To summarize data.
   - **Histograms**: To visualize data distribution.
   - **Box plots**: To identify outliers and data spread.

#### Example Use Cases

Let's explore some practical examples of how the `manufacturing` package can be used.

##### 1. Creating an X-bar and R Chart

Suppose you are monitoring the diameter of metal rods produced in a factory. You collect samples of five rods every hour and measure their diameters.

```python
import manufacturing as mn

# Sample data: each sublist represents diameters of five rods measured every hour
data = [
    [5.1, 5.2, 5.3, 5.0, 5.1],
    [5.2, 5.1, 5.3, 5.2, 5.1],
    [5.0, 5.1, 5.0, 5.2, 5.3],
    [5.1, 5.2, 5.2, 5.1, 5.0],
    [5.2, 5.1, 5.3, 5.2, 5.1]
]

# Create X-bar and R chart
mn.xbar_r_chart(data)
```

This code generates an X-bar and R chart, helping you visualize whether the diameter measurements are within acceptable control limits.

##### 2. Calculating Process Capability Indices

Assume you have a process with a target diameter of 5.0 units and tolerance limits of ±0.2 units. You want to calculate the Cp and Cpk indices to understand the process capability.

```python
import numpy as np

# Example data: diameters measured from the process
diameters = np.array([5.1, 5.2, 5.0, 5.1, 5.2, 5.3, 5.1, 5.0, 5.2, 5.3])

# Specification limits
USL = 5.2  # Upper specification limit
LSL = 4.8  # Lower specification limit

# Calculate Cp and Cpk
cp_value = mn.cp(diameters, USL, LSL)
cpk_value = mn.cpk(diameters, USL, LSL)

print(f"Cp: {cp_value}")
print(f"Cpk: {cpk_value}")
```

These calculations show how capable your process is in meeting the specification limits.

#### Benefits for Non-Manufacturing Audiences

While the `manufacturing` package is tailored for manufacturing processes, its tools for statistical analysis and data visualization can be beneficial for various fields. For example:
- **Quality Control in Service Industries**: Control charts can be used to monitor service quality metrics like customer wait times or error rates.
- **Healthcare**: Hospitals can use these tools to monitor patient recovery times or infection rates.
- **Software Development**: Development teams can track defect rates and process stability over different software releases.

## 5. Alternatives to the `manufacturing` Python Package

While the `manufacturing` package is a robust tool for statistical process control (SPC) and process capability analysis, several other Python packages offer similar functionalities. Here are a few notable ones:

1. **SciPy and NumPy**: These are fundamental packages for scientific computing in Python. While not specifically tailored for manufacturing, they provide extensive capabilities for statistical analysis and data manipulation, which can be used to create custom SPC tools.

2. **PySPC**: This package is designed specifically for statistical process control and includes functions for creating control charts and other SPC tools.

3. **Quality-Control**: This package focuses on quality control methods and includes tools for control charts, process capability indices, and other SPC techniques.

### Example: Using PySPC for Control Charts

Let's look at an example of creating a control chart using the PySPC package.

```python
import pyspc

# Sample data: diameters of rods measured over time
data = [5.1, 5.2, 5.0, 5.1, 5.2, 5.3, 5.1, 5.0, 5.2, 5.3]

# Create a control chart
chart = pyspc.x_mr(data)
chart.plot()
```

This code snippet demonstrates how to create an X-MR (individuals and moving range) chart using PySPC.

## Conclusion

Understanding key concepts like CpK and Six Sigma is crucial for improving manufacturing processes and ensuring high-quality output.

The `manufacturing` Python package is a versatile and user-friendly tool that simplifies the process of monitoring and improving production processes. Whether you're in manufacturing or another field, the statistical analysis and visualization capabilities of this package can help you ensure quality and efficiency in your operations.

Several Python packages can help you with SPC and process capability analysis, each with its own strengths and weaknesses.

For more information and detailed documentation of the `manufacturing` Python, you can visit the [official PyPI page](https://pypi.org/project/manufacturing/).

## Final note

For practical implementation everything mentioned here, please take look at the notebook that I created here: https://github.com/realivanivani/blog-posts/blob/main/Manufacturing_Py.ipynb


For further reading and practical examples, you can explore the documentation and resources provided by each package. Here are some links to get you started:
- [SciPy Documentation](https://docs.scipy.org/doc/scipy/)
- [NumPy Documentation](https://numpy.org/doc/stable/)
- [PySPC Documentation](https://pypi.org/project/pyspc/)
- [Quality-Control Package](https://pypi.org/project/quality-control/)
