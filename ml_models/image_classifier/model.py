"""
Image Classifier Placeholder
=============================
Fine-tune ResNet-50 on CrisisMMD / MEDIC dataset,
then save model.pt here and update backend/ml_integration.py.

Classes: flood | fire | earthquake | cyclone | normal

Quick start:
    pip install torch torchvision pillow

    import torch
    import torchvision.models as models
    from torch import nn

    model = models.resnet50(pretrained=True)
    model.fc = nn.Linear(model.fc.in_features, 5)  # 5 disaster classes

    # ... fine-tune on CrisisMMD, then:
    torch.save(model.state_dict(), "./ml_models/image_classifier/model.pt")
"""

CLASSES = ["flood", "fire", "earthquake", "cyclone", "normal"]

def predict(image_path: str) -> dict:
    """Replace with real model inference"""
    raise NotImplementedError("Train and load a real model first")
