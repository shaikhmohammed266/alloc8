# ML Models — Placeholder Folder

Place your trained model files here once built.

## Structure

```
ml_models/
├── text_classifier/          ← BERT fine-tuned on Kaggle NLP Disaster tweets
│   ├── config.json
│   ├── pytorch_model.bin
│   └── tokenizer/
│
├── image_classifier/         ← ResNet-50 fine-tuned on CrisisMMD / MEDIC
│   └── model.pt
│
├── resource_predictor/       ← Regression model for resource prediction
│   └── model.pkl
│
└── README.md
```

## Datasets

| Model | Dataset | Link |
|-------|---------|------|
| Tweet Classifier | Kaggle NLP Disaster | https://www.kaggle.com/competitions/nlp-getting-started |
| Image Classifier | CrisisMMD | https://crisisnlp.qcri.org/crisismmd |
| Image Classifier | MEDIC | https://huggingface.co/datasets/QCRI/MEDIC |
| Resource Predictor | Custom / historical data | — |

## Integration

Once trained, update `backend/ml_integration.py`:

```python
# Example — swap dummy with real BERT model
from transformers import pipeline

_text_model = pipeline("text-classification",
                        model="./ml_models/text_classifier")

def predict_disaster_text(text: str) -> dict:
    result = _text_model(text)[0]
    return {
        "is_disaster":    result["label"] == "DISASTER",
        "predicted_type": result["label"].lower(),
        "confidence":     round(result["score"], 3),
        "model":          "bert-fine-tuned-v1"
    }
```
