---
title: 'SQL - The most used tool among Data Scientist and Analysts'
date: 2024-06-13
permalink: /posts/2024/06/blog-post-1/
tags:
  - sql
  - essentials
  - queries
  - data analytics
---

In the world of data analysis, SQL (Structured Query Language) is the fundamental rock. It's the language that allows you to communicate with databases, extracting, manipulating, and analyzing data with precision. Whether you're a seasoned analyst or just starting your journey, a solid grasp of SQL is essential for uncovering meaningful patterns and driving data-informed decisions. This blog post will cover the fundamental concepts of SQL, basic query structures, and the software tools that empower data analysts. But first let's answer what is a database and what are two main categories of databases.

**Two database types**

A database is a collection of structured and related data organized in a way that data can be easily accessed and managed. In short, the database is one way to store data. You deal with databases every day, for example, your photos are stored in your smartphone’s gallery, this gallery is a database. There are many different types of databases such as relational databases, distributed databases, cloud databases, data warehouses, but all of them fall into 2 categories, **relational (SQL)** and **non-relational (NoSQL)** databases:

![image](https://github.com/user-attachments/assets/4fe8676a-0dc1-4abd-850f-245c62433121)

**Relational (SQL) Database**
A Relational (SQL) Database consists of different tables like customers, orders, products..etc which are related to each other and have a fixed schema. If your data is very structured, easy to understand, highly organized, SQL is a great choice.

**Non-Relational (NoSQL) Database**
NoSQL Database stands for Not Only SQL or Not SQL refers to high-performance, and non-relational data stores but it comes at the price of lower flexibility and high complexity when querying the data. A non-relational (NoSQL) database is ideal for projects facing changing data requirements. If you are facing changing data requirements, you have to store different types of data such as unstructured data, or your data hard to understand,  NoSQL may be your best bet.

**SQL language**

SQL stands for Structured Query Language and by definition is a query language used for storing, retrieving, managing, or manipulating the data inside databases. In short, SQL is the language you use to talk to databases. You might hear on the Internet about the neverending battles about how SQL should be pronounced. Many English-speaking database professionals are for **Sequal**, others are for **S-Q-L**. I pronounce it both ways, depending on the level of the person that I am speaking to.

Why is SQL so vital? Because it enables us to:

* **Retrieve Specific Data:** Target and extract the exact information needed for analysis.
* **Filter and Sort Data:** Refine datasets to focus on relevant subsets.
* **Aggregate Data:** Summarize large volumes of data for high-level insights.
* **Join Tables:** Combine data from multiple sources for comprehensive analysis.
* **Perform Complex Calculations:** Derive new metrics and insights through calculations.

In essence, SQL empowers us to ask complex questions of our data and receive clear, actionable answers.

**Software Tools for SQL Data Analysis:**

Data analysts have a wide range of software options for working with SQL:

* **Database Management Systems (DBMS):**
    * **MySQL:** A popular open-source DBMS.
    * **PostgreSQL:** Another powerful open-source option known for its extensibility.
    * **Microsoft SQL Server:** A robust enterprise-grade DBMS.
    * **Oracle Database:** A widely used commercial DBMS.
* **SQL Clients:**
    * **DBeaver:** A free and open-source universal database tool.
    * **MySQL Workbench:** The official GUI tool for MySQL.
    * **SQL Developer:** Oracle's free development environment.
* **Cloud-Based Data Warehouses:**
    * **Amazon Redshift:** A fast, scalable data warehouse.
    * **Google BigQuery:** A serverless, highly scalable data warehouse.
    * **Snowflake:** A cloud-based data warehousing platform.
* **Data Analysis Platforms:**
    * Many data analysis platforms like Tableau, Power BI, and Python (with libraries like pandas and SQLAlchemy) also offer SQL connectivity for data retrieval.
      
The Basics: SQL Queries and Commands
------
SQL is a standardized programming language designed for managing and manipulating relational databases. These databases organize data into tables, with rows representing individual records and columns representing attributes

**Key SQL Commands for Data Analysts:**

Before we dive into advanced techniques, let's cover the foundational elements of SQL:

* **SELECT:** Used to retrieve data from a table.
* **FROM:** Specifies the table from which data is retrieved.
* **WHERE:** Filters data based on specified conditions.
* **GROUP BY:** Groups rows with the same values into summary rows.
* **ORDER BY:** Sorts the retrieved data in ascending or descending order.

* * **COUNT, SUM, AVG, MIN, MAX:** Aggregate functions for summarizing data.
* **DISTINCT:** Retrieves unique values from a column.
* **LIKE:** Performs pattern matching for text data.
* **AS:** Renames columns or tables for clarity.
  
* **JOIN (INNER, LEFT, RIGHT, FULL):** Combines rows from multiple tables based on related columns.
* **INSERT:** Adds new rows to a table.
* **UPDATE:** Modifies existing rows in a table.
* **DELETE:** Removes rows from a table.

A basic SQL query structure looks like this:

```sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1;
```

**More advanced SQL Techniques for Data Analysis**

Now, let's explore five techniques that can significantly enhance your data analysis capabilities, based on the video you provided. Since I don't have direct access to the video, I'll provide common and very useful techniques that are very often used in data analysis.

**1. Window Functions: Calculating Running Totals and Ranks**

Window functions perform calculations across a set of table rows that are related to the current row. They are particularly useful for calculating running totals, moving averages, and ranks.

```sql
SELECT
    order_id,
    order_date,
    order_amount,
    SUM(order_amount) OVER (ORDER BY order_date) AS running_total,
    RANK() OVER (ORDER BY order_amount DESC) AS order_rank
FROM
    orders;
```

* `SUM(order_amount) OVER (ORDER BY order_date)`: Calculates the cumulative sum of order amounts, ordered by date.
* `RANK() OVER (ORDER BY order_amount DESC)`: Assigns a rank to each order based on its amount, with the highest amount receiving the top rank.

**2. Common Table Expressions (CTEs): Simplifying Complex Queries**

CTEs are temporary result sets that you can reference within a SELECT, INSERT, UPDATE, or DELETE statement. They enhance readability and maintainability of complex queries.

```sql
WITH MonthlySales AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        SUM(order_amount) AS total_sales
    FROM
        orders
    GROUP BY
        month
)
SELECT
    month,
    total_sales
FROM
    MonthlySales
ORDER BY
    month;
```

* This CTE, `MonthlySales`, calculates the total sales for each month, making the main query cleaner.

**3. Subqueries: Nested Data Retrieval**

Subqueries are queries nested within another query. They are used to retrieve data that will be used in the main query's conditions.

```sql
SELECT
    customer_name,
    order_amount
FROM
    orders
WHERE
    order_amount > (SELECT AVG(order_amount) FROM orders);
```

* This query retrieves customers and order amounts for orders that exceed the average order amount.

**4. String Manipulation: Extracting and Transforming Text Data**

SQL provides functions to manipulate text data, such as extracting substrings, concatenating strings, and changing case.

```sql
SELECT
    customer_name,
    SUBSTRING(customer_email, POSITION('@' IN customer_email) + 1) AS domain
FROM
    customers;
```

* `SUBSTRING(customer_email, POSITION('@' IN customer_email) + 1)`: Extracts the domain name from customer email addresses.

**5. Date and Time Functions: Analyzing Time-Series Data**

Date and time functions are essential for analyzing trends and patterns over time.

```sql
SELECT
    DATE_TRUNC('week', order_date) AS week_start,
    COUNT(order_id) AS weekly_orders
FROM
    orders
GROUP BY
    week_start
ORDER BY
    week_start;
```

* `DATE_TRUNC('week', order_date)`: Truncates order dates to the beginning of the week, allowing for weekly aggregation.

**More resources**

For more essential SQL queries, you can check my [git repository](https://github.com/realivanivani/sql-queries) with essential sql queries that I constantly reuse for new projects. 

Here is also a nicely done [SQL cheatsheet](https://www.datawithbaraa.com/wp-content/uploads/2024/11/SQL-30-Performance-Tips-_-Cheat-Sheet.pdf) with good practices in query building.

Another really good source are [tutorias](https://www.datawithbaraa.com/sql-introduction/) and more about SQL techniques, database structures and architecture from [Baraa](https://www.youtube.com/@DataWithBaraa) 

**Conclusion**

Mastering these SQL techniques will significantly enhance your ability to extract meaningful insights from your data. Practice these techniques with real-world datasets, and you'll be well on your way to becoming a proficient data analyst or data scientist.
