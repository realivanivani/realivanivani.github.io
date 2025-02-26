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

In the world of data analysis, SQL (Structured Query Language) is the fundamental rock. It's the language that allows you to communicate with databases, extracting, manipulating, and analyzing data with precision. Whether you're a seasoned analyst or just starting your journey, a solid grasp of SQL is essential for uncovering meaningful patterns and driving data-informed decisions. This blog post will cover the fundamental concepts of SQL, basic query structures, and the software tools that empower data analysts.

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

**Database Structure and Collaborative Usage**

In a collaborative environment, a well-structured database is crucial. Typically, databases are organized into tables, with each table representing a specific entity (e.g., customers, products, orders). Different members might have varying levels of access and usage patterns. Data analysts and scientists primarily use SQL to query and extract data for analysis, focusing on `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `ORDER BY`, and `JOIN` operations. Database administrators manage the database structure, user permissions, and overall performance, using commands like `CREATE`, `ALTER`, and `GRANT`. Developers might interact with the database through applications, using SQL to insert, update, and delete data (`INSERT`, `UPDATE`, `DELETE`). A clear understanding of the database schema and access privileges ensures efficient collaboration and data integrity.

![database strcture with sql](https://github.com/user-attachments/assets/49e600e5-9c94-4ab5-a4a7-1542bd51ff8c)

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
