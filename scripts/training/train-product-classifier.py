"""Train and export the browser-local multilingual product category classifier.
Requires numpy and scikit-learn. Training examples contain no visitor data.
Run from the repository root: python scripts/training/train-product-classifier.py
"""
from pathlib import Path
import json,re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
ROOT=Path(__file__).resolve().parents[2]
STOP=set('я мы для на из в и с по это нужен нужна нужно хочу продавать производить ввозить произвожу производим продаю импортирую товар продукция категория пожалуйста какой какая где the a an for with and of i we want to sell selling make manufacture import my product please what which'.split())
def features(text):
 words=re.findall(r'[a-zа-я0-9\u3400-\u9fff]+',text.lower().replace('ё','е'))
 result=[]
 for word in words:
  if word in STOP:continue
  result.append('w:'+word)
  padded=' '+word+' '
  for n in (2,3,4):
   for i in range(len(padded)-n+1):result.append(padded[i:i+n])
 return result

def vectorizer():return TfidfVectorizer(analyzer=features,lowercase=False,sublinear_tf=True,max_features=14000)
def model():return LogisticRegression(C=9,max_iter=1500,class_weight='balanced',random_state=41)
data=json.loads((ROOT/'scripts/training/product-training-data.json').read_text());texts=[];labels=[];groups=[]
for category,languages in data.items():
 for language,examples in languages.items():
  for example in examples.split(';'):
   texts.append(example.strip());labels.append(category);groups.append(category+':'+language)
train,test=train_test_split(np.arange(len(texts)),test_size=.2,random_state=41,stratify=groups)
v=vectorizer();classifier=model();classifier.fit(v.fit_transform([texts[i] for i in train]),[labels[i] for i in train]);predicted=classifier.predict(v.transform([texts[i] for i in test]));accuracy=accuracy_score([labels[i] for i in test],predicted)
validation_probs=classifier.predict_proba(v.transform([texts[i] for i in test]));sorted_probs=np.sort(validation_probs,axis=1);confident=(sorted_probs[:,-1]>=.65)&((sorted_probs[:,-1]-sorted_probs[:,-2])>=.2);confident_count=int(confident.sum());confident_accuracy=float((predicted[confident]==np.array([labels[i] for i in test])[confident]).mean()) if confident_count else None
v=vectorizer();x=v.fit_transform(texts);classifier=model();classifier.fit(x,labels)
terms=v.get_feature_names_out().tolist();coefficients=np.round(classifier.coef_.T,6).tolist();export={'version':1,'kind':'tfidf-character-word-logistic-regression','languages':['ru','en','zh'],'classes':classifier.classes_.tolist(),'terms':terms,'idf':np.round(v.idf_,6).tolist(),'weights':coefficients,'bias':np.round(classifier.intercept_,6).tolist(),'stopWords':sorted(STOP),'trainingExamples':len(texts),'validation':{'method':'stratified-holdout-20-percent-by-category-and-language','examples':len(test),'accuracy':round(accuracy,4),'confidentSuggestionThreshold':.65,'minimumMargin':.2,'confidentExamples':confident_count,'confidentAccuracy':round(confident_accuracy,4) if confident_accuracy is not None else None},'notes':'Category suggestions only. Not a legal assessment or certification decision.'}
path=(ROOT/'public/assets')/'product-category-model.json';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(export,ensure_ascii=False,separators=(',',':')))
checks={'ваза':'dishes','стеклянная ваза для цветов':'dishes','керамические вазочки':'dishes','свитер':'textile','кабель для телефона':'electronics','детская футболка':'children','средство для мытья пола':'chemicals','пластиковая упаковка':'packaging','vase':'dishes','glass flower vase':'dishes','cotton sweater':'textile','safety helmet':'protection','花瓶':'dishes','陶瓷花瓶':'dishes','童装':'children','护手霜':'beauty'}
results={}
for query,wanted in checks.items():
 probs=classifier.predict_proba(v.transform([query]))[0];idx=int(np.argmax(probs));got=classifier.classes_[idx];results[query]={'expected':wanted,'actual':got,'probability':round(float(probs[idx]),3)}
 if got!=wanted:raise RuntimeError(f'Acceptance failure: {query} -> {got}, expected {wanted}')
(ROOT/'scripts/training/product-model-validation.json').write_text(json.dumps({'validation':export['validation'],'acceptance':results},ensure_ascii=False,indent=2))
print(json.dumps({'examples':len(texts),'features':len(terms),'bytes':path.stat().st_size,'heldoutAccuracy':round(accuracy,3),'acceptanceChecks':len(checks),'vase':results['ваза']},ensure_ascii=False))
