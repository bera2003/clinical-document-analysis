import spacy

nlp = spacy.load("en_core_web_sm")

def extract_clinical_entities(text):

    doc = nlp(text)

    result = {
        "patient_names": [],
        "ages": [],
        "dates": [],
        "medications": [],
        "numbers": [],
        "possible_symptoms": []
    }

    for ent in doc.ents:

        if ent.label_ == "PERSON":
            result["patient_names"].append(ent.text)

        elif ent.label_ == "DATE":
            result["dates"].append(ent.text)

        elif ent.label_ == "PRODUCT":
            result["medications"].append(ent.text)

        elif ent.label_ == "CARDINAL":
            result["numbers"].append(ent.text)

    # Detect symptoms using dependency tokens
    symptom_words = [
        "pain", "fever", "cough", "vomiting",
        "shortness of breath", "headache"
    ]

    for token in doc:
        for symptom in symptom_words:
            if symptom in token.text.lower():
                result["possible_symptoms"].append(token.text)

    return result