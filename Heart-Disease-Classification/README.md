# End-to-End Heart Disease Classification

This project aims to predict whether a patient has heart disease based on clinical parameters using machine learning techniques.

## Table of Contents
1. [Problem Definition](#problem-definition)
2. [Data](#data)
3. [Evaluation](#evaluation)
4. [Features](#features)
5. [Modelling](#modelling)
6. [Experimentation](#experimentation)
7. [What We Applied and Learned](#what-we-applied-and-learned)
8. [Usage](#usage)
9. [Installation](#installation)
10. [Contributing](#contributing)
11. [License](#license)

## Problem Definition
Given clinical parameters about a patient, can we predict whether or not they have heart disease?

## Data
The dataset used for this project comes from the Cleveland data from the UCI Machine Learning Repository. It is also available on Kaggle:
- [Kaggle Dataset](https://www.kaggle.com/datasets/thisishusseinali/uci-heart-disease-data)
- [UCI Repository](https://archive.ics.uci.edu/ml/datasets/Heart+Disease)

## Evaluation
To determine the success of this project, we aim to achieve at least 95% accuracy in predicting whether a patient has heart disease.

## Features
The dataset includes the following features:
1. age - Age in years
2. sex - (1 = male; 0 = female)
3. cp - Chest pain type (0: Typical angina, 1: Atypical angina, 2: Non-anginal pain, 3: Asymptomatic)
4. trestbps - Resting blood pressure (in mm Hg on admission to the hospital)
5. chol - Serum cholesterol in mg/dl
6. fbs - Fasting blood sugar > 120 mg/dl (1 = true; 0 = false)
7. restecg - Resting electrocardiographic results (0: Nothing to note, 1: ST-T Wave abnormality, 2: Left ventricular hypertrophy)
8. thalach - Maximum heart rate achieved
9. exang - Exercise-induced angina (1 = yes; 0 = no)
10. oldpeak - ST depression induced by exercise relative to rest
11. slope - Slope of the peak exercise ST segment (0: Upsloping, 1: Flatsloping, 2: Downsloping)
12. ca - Number of major vessels colored by fluoroscopy (0-3)
13. thal - Thalassemia (1 = fixed defect, 2 = normal, 3 = reversible defect)
14. target - Heart disease (1 = yes, 0 = no)

## Modelling
The following steps are taken in the modelling process:
1. Data Cleaning: Handling missing values, encoding categorical variables, and feature scaling.
2. Exploratory Data Analysis (EDA): Visualizing the data to identify patterns and relationships.
3. Model Training: Training various machine learning models including Logistic Regression and Random Forest.
4. Model Evaluation: Evaluating models using metrics such as accuracy, precision, recall, F1 score, and ROC-AUC.

## Experimentation
Future improvements and experiments:
- Collect additional data.
- Try advanced models like XGBoost or CatBoost.
- Improve current models with hyperparameter tuning and cross-validation.

## What We Applied and Learned
### What We Applied
1. Data Preprocessing: Techniques for handling missing values, encoding categorical data, and normalizing features.
2. Exploratory Data Analysis (EDA): Visualization tools and methods to understand data distributions and relationships.
3. Model Selection and Training: Implementing and training various machine learning models, such as Logistic Regression and Random Forest.
4. Hyperparameter Tuning: Using RandomizedSearchCV and GridSearchCV to optimize model parameters.
5. Model Evaluation: Evaluating models using accuracy, precision, recall, F1 score, ROC-AUC, and confusion matrices.
6. Feature Importance Analysis: Identifying which features have the most impact on model predictions.
   
### What We Learned
1. Importance of Data Quality: The accuracy and reliability of the model heavily depend on the quality of the data.
2. Feature Engineering: Creating and selecting meaningful features can significantly enhance model performance.
3. Model Selection: Different models have varying performance based on the dataset; it’s crucial to experiment with multiple models.
4. Evaluation Metrics: Understanding and choosing the right evaluation metrics is key to correctly assessing model performance.
5. Hyperparameter Tuning: Proper tuning can drastically improve model performance, making it a critical step in the machine learning pipeline.
6. Interpreting Model Results: Being able to explain and interpret the results of the model is as important as building the model itself.

