"""
Breast Cancer Prediction — Modular ML Pipeline
Author: Gayam Sai Kowshik Reddy
"""

import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, classification_report,
    roc_auc_score, f1_score, confusion_matrix
)
import warnings
warnings.filterwarnings("ignore")

RANDOM_STATE = 42


def load_data() -> tuple[pd.DataFrame, pd.Series]:
    """Load and return features and labels from the WBCD dataset."""
    data = load_breast_cancer()
    X = pd.DataFrame(data.data, columns=data.feature_names)
    y = pd.Series(data.target, name="target")
    return X, y


def preprocess(X_train, X_test) -> tuple:
    """
    Fit StandardScaler on training data and transform both splits.
    Returns scaled arrays and the fitted scaler.
    No data leakage: scaler sees only X_train.
    """
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled, scaler


def cross_validate_models(X_train_scaled, y_train, cv: int = 5) -> dict:
    """Run 5-fold CV on all candidate models. Returns dict of scores."""
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=RANDOM_STATE),
        "SVM (RBF)": SVC(kernel="rbf", probability=True, random_state=RANDOM_STATE),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=RANDOM_STATE),
    }
    results = {}
    for name, model in models.items():
        scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring="accuracy")
        results[name] = {"mean": scores.mean(), "std": scores.std(), "scores": scores}
        print(f"  {name:<25}  CV Accuracy: {scores.mean():.4f} ± {scores.std():.4f}")
    return results


def tune_svm(X_train_scaled, y_train) -> SVC:
    """
    GridSearchCV for SVM hyperparameters.
    Optimises for recall (malignant class) — clinically motivated.
    """
    param_grid = {
        "C": [0.1, 1, 10, 100],
        "gamma": ["scale", "auto", 0.001, 0.01],
        "kernel": ["rbf", "linear"],
    }
    grid = GridSearchCV(
        SVC(probability=True, random_state=RANDOM_STATE),
        param_grid, cv=5, scoring="recall", n_jobs=-1
    )
    grid.fit(X_train_scaled, y_train)
    print(f"\n  Best SVM params : {grid.best_params_}")
    print(f"  Best CV recall  : {grid.best_score_:.4f}")
    return grid.best_estimator_


def evaluate(model, X_test_scaled, y_test, model_name: str = "Model") -> dict:
    """Return accuracy, ROC-AUC, F1, and full classification report."""
    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "roc_auc": roc_auc_score(y_test, y_prob),
        "f1": f1_score(y_test, y_pred),
        "confusion_matrix": confusion_matrix(y_test, y_pred),
        "report": classification_report(y_test, y_pred,
                                        target_names=["Malignant", "Benign"]),
    }

    print(f"\n{'='*50}")
    print(f"  {model_name} — Test Set Results")
    print(f"{'='*50}")
    print(f"  Accuracy  : {metrics['accuracy']*100:.2f}%")
    print(f"  ROC-AUC   : {metrics['roc_auc']:.4f}")
    print(f"  F1 Score  : {metrics['f1']:.4f}")
    print(f"\n{metrics['report']}")
    return metrics


def run_pipeline():
    """End-to-end pipeline: load → split → scale → CV → tune → evaluate."""
    print("Breast Cancer Prediction Pipeline")
    print("=" * 50)

    # 1. Load
    X, y = load_data()
    print(f"\nDataset: {X.shape[0]} samples, {X.shape[1]} features")
    print(f"Class balance — Malignant: {(y==0).sum()}, Benign: {(y==1).sum()}")

    # 2. Split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )

    # 3. Scale
    X_train_sc, X_test_sc, scaler = preprocess(X_train, X_test)

    # 4. Cross-validate
    print("\n5-Fold Cross-Validation:")
    cv_results = cross_validate_models(X_train_sc, y_train)

    # 5. Tune best model (SVM)
    print("\nTuning SVM hyperparameters via GridSearchCV...")
    best_svm = tune_svm(X_train_sc, y_train)

    # 6. Final evaluation
    best_svm.fit(X_train_sc, y_train)
    metrics = evaluate(best_svm, X_test_sc, y_test, model_name="Tuned SVM")

    return best_svm, scaler, metrics


if __name__ == "__main__":
    run_pipeline()
