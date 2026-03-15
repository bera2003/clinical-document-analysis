import spacy

nlp = spacy.load("en_core_web_sm")

def analyze_text(text):
    doc = nlp(text)

    result = {
        "patient_names": [],
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

    text_lower = text.lower()
    symptom_words = [
        "chest pain",
        "pain",
        "fever",
        "cough",
        "vomiting",
        "shortness of breath",
        "headache"
    ]

    for symptom in symptom_words:
        if symptom in text_lower:
            result["possible_symptoms"].append(symptom)

    entities = []

    for name in result["patient_names"]:
        entities.append({"text": name, "label": "PATIENT_NAME"})

    for num in result["numbers"]:
        entities.append({"text": num, "label": "NUMBER"})

    for date in result["dates"]:
        entities.append({"text": date, "label": "DATE"})

    for med in result["medications"]:
        entities.append({"text": med, "label": "MEDICATION"})

    for symptom in result["possible_symptoms"]:
        entities.append({"text": symptom, "label": "SYMPTOM"})

    return entities