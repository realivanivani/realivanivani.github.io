---
title: "SQL Data Cleaning and Preparation for Analysis"
excerpt: "Transforming Raw Coffee Survey Data: A PostgreSQL Cleaning Journey <br/><img src='/images/coffee.png'>"
collection: portfolio
---

Introduction
----

## Dataset Details

I came across this data analysis of coffee taste and preferances by [Robert McKeon Aloe](https://rmckeon.medium.com/great-american-coffee-taste-test-breakdown-7f3fdcc3c41d), and I thought about exploring the data. This dataset was collected in October 2023 when [&#34;world champion barista&#34; James Hoffmann](https://www.youtube.com/watch?v=bMOOQfeloH0) and coffee company Cometeer held the "Great American Coffee Taste Test" on YouTube, during which viewers were asked to fill out a survey about 4 coffees they ordered from Cometeer for the tasting. As I love good coffee and I follow James Hoffmann on YT, I decided to play with the dataset.

## Project Overview

My main task was to clean up the raw coffee survey data and standardize certain aspects of it and prepare it for further analysis. The main things I did were to rename columns into sensible names & dropping some attributes for easier exploration, handling NULL values, and also reformatting some values' types. Dataset has 56 columns and 4041 entries. I used Jupyter Notebook for initial exploration of the raw data (you can also find the ipynb file here)

* SQL Skills Used: Table Creation & Alteration, Data Manipulation, Data Type Conversion, Handling Missing Values, Normalization.
* [View SQL Import Script](https://github.com/realivanivani/sql-portfolio/blob/main/coffee-survey/import.sql)
* [View SQL Cleaning Script](https://github.com/realivanivani/sql-portfolio/blob/main/coffee-survey/coffee_dataset_clean_prep.sql)

When working with survey data, raw responses often arrive in a messy state—inconsistent formats, mixed data types, and ambiguous values. In this project, I tackled a coffee consumption survey dataset with over 100 columns of responses. Through a systematic PostgreSQL cleaning process, I transformed this raw data into an analysis-ready format while preserving data integrity.

## Step 1: Setting Up the Foundation

Before any cleaning could begin, I needed to properly import the CSV data:

```bash
csvsql -i postgresql GACTT_RESULTS_ANONYMIZED_v2.csv > create_table.sql
```

This command generated a SQL table creation script that handled the initial import. I then created a staging table to preserve the raw data while working on transformations:

```sql
CREATE TABLE coffee_survey_staging (LIKE raw_coffee_survey INCLUDING ALL);
INSERT INTO coffee_survey_staging SELECT * FROM raw_coffee_survey;
```

## Step 2: Standardizing Column Names

The original survey used long, question-form column names that were impractical for analysis. I standardized them to be more concise and consistent:

- 'What is your age?' → `age`
- 'Where do you typically drink coffee?' → `drink_location`
- 'How many cups of coffee do you drink daily?' → `daily_coffee_cups`

This naming convention made the data more manageable and queries more readable.

## Step 3: Data Type Conversion

The initial import treated all columns as text. I systematically converted them to appropriate data types:

### Numerical Ratings to Integers
```sql
ALTER TABLE coffee_survey_staging
ALTER COLUMN self_rated_expertise TYPE INT USING self_rated_expertise::decimal,
ALTER COLUMN coffee_a_bitterness TYPE INT USING coffee_a_bitterness::decimal;
```

### Boolean Conversion
For True/False and Yes/No responses:
```sql
UPDATE coffee_survey_staging
SET likes_coffee_taste = CASE 
    WHEN likes_coffee_taste = 'Yes' THEN TRUE 
    WHEN likes_coffee_taste = 'No' THEN FALSE 
    ELSE NULL END;
```

## Step 4: Handling Missing Values

Missing data required a nuanced approach:

1. **Critical Fields**: Dropped rows where essential fields like age were NULL
2. **Optional Fields**: Replaced NULLs with "Unknown" or "No Response"
3. **Empty Strings**: Converted '' to NULL for consistency
4. **Sparse Columns**: Dropped columns with >90% missing data

```sql
UPDATE coffee_survey_staging
SET age = CASE WHEN age = '' THEN NULL ELSE age END;
```

## Step 5: Value Standardization

Survey responses often have variations of the same concept. I standardized:

### Age Ranges
```sql
UPDATE coffee_survey_staging
SET age = REPLACE(age, ' years old', '');
```

### Numerical Categories
For "More than X" and "Less than X" responses:
```sql
UPDATE coffee_survey_staging
SET max_paid_for_coffee = REPLACE(max_paid_for_coffee, 'More than ', '>');
```

### Categorical Values
Converted text to lowercase with underscores for consistency (e.g., "Several times a day" → "multiple_per_day")

## Step 6: Column Management

I reviewed all columns and:
- Dropped redundant summary columns
- Removed completely empty columns
- Eliminated columns irrelevant to our analysis

```sql
ALTER TABLE coffee_survey_staging
DROP COLUMN purchase_location_on_the_go,
DROP COLUMN coffee_drink_location;
```

## Step 7: Quality Checks

Final validation ensured data integrity:
```sql
-- Check for duplicate submissions
SELECT COUNT(DISTINCT submission_id) FROM coffee_survey_staging;

-- Review distinct values in key columns
SELECT DISTINCT daily_coffee_cups FROM coffee_survey_staging ORDER BY daily_coffee_cups;
```

## Key Challenges and Solutions

1. **Text Line Breaks**: Fixed carriage returns in political affiliation responses
```sql
UPDATE coffee_survey_staging
SET political_affiliation = REPLACE(political_affiliation,'\r','');
```

2. **Categorical to Numerical**: Created temporary columns to safely transform categories like "More than 4" to numerical 5
```sql
ALTER TABLE coffee_survey_staging ADD COLUMN daily_coffee_cups_cleaned INT;
UPDATE coffee_survey_staging
SET daily_coffee_cups_cleaned = CASE
    WHEN daily_coffee_cups = 'More than 4' THEN 5
    WHEN daily_coffee_cups = 'Less than 1' THEN 0
    ELSE daily_coffee_cups::INT END;
```

## Conclusion

Through this systematic cleaning process, I transformed a messy survey dataset into a structured, analysis-ready resource. The key takeaways:

1. Always preserve raw data by working in staging tables
2. Document every transformation step for reproducibility
3. Balance automated processing with manual validation
4. Make conservative decisions about handling missing data

The cleaned dataset now enables reliable analysis of coffee consumption patterns, preferences, and demographics—revealing insights that would have been obscured by the original data quality issues.
