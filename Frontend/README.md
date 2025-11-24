
# Token Finansal AI Asistanı / Token Financial AI Assistant
---

[🇹🇷 Türkçe](#türkçe) | [🇬🇧 English](#english)

## Türkçe
# Token Finansal AI Asistanı  

Akıllı sohbet asistanı, **Beko 300TR** yazarkasa/POS cihazı için müşteri desteğini hızlandırmak amacıyla geliştirilmiştir.  

- **Problem**: Müşteri hizmetleri ekipleri dağınık dokümanlardan doğru bilgiye ulaşmakta zorlanıyor, bu da zaman kaybı ve müşteri memnuniyetsizliğine yol açıyor.  
- **Çözüm**: Retrieval-Augmented Generation (RAG) ile belgelerden arama yaparak hızlı, güvenilir ve görselle desteklenmiş yanıtlar sağlanır.  

---

## Çalıştırma  

### Backend  
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

* Servis FastAPI ile çalışır.
* Diyagram görselleri `/images` altında servis edilir.

### Frontend 
```bash
npm install
npm run dev
```

* React tabanlı kullanıcı arayüzü.
* Sohbet geçmişi, mod seçici (Workflow / POS), diyagram gösterimi içerir.

## ⚙️ Teknik Özet (Backend) 

* FastAPI: REST tabanlı API.

* LangChain + FAISS: Belgelerden (CSV/PDF) vektör indeksleme ve arama.

* RAG Pipeline: Kullanıcı sorularını önce anlamlandırır, ardından ilgili belgelerden yanıt üretir.

* Sohbet Yönetimi: JSON tabanlı saklama, yeniden adlandırma, silme desteği.

* Diyagram Desteği: Yanıta ait görseller otomatik bulunur ve frontend’e iletilir.

* Filtreleme: Yalnızca Beko 300TR cihazı için yanıt döner, diğer model/markalarda uyarı verir.

------------------------ 
👉 Bu proje, müşteri hizmetleri verimliliğini artırmayı ve kullanıcıların kendi sorularını hızlıca çözebilmelerini amaçlar.



---

## English
# Token Financial AI Assistant  

An intelligent chat assistant built to accelerate customer support for the **Beko 300TR** cash register/POS device.  

- **Problem**: Customer service teams struggle to find the right information across scattered documents, leading to delays and lower customer satisfaction.  
- **Solution**: Using Retrieval-Augmented Generation (RAG), the system retrieves information directly from documents, delivering fast, reliable, and visually supported answers.  

---

## Running the Project  

### Backend  
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

* The service runs on FastAPI.
* Diagram images are served under /images.

### Frontend 
```bash
npm install
npm run dev
```

* React-based user interface.
* Includes chat history, mode switcher (Workflow / POS), and diagram display.


## Technical Summary (Backend)

* FastAPI: REST-based API.

* LangChain + FAISS: Vector indexing and search over documents (CSV/PDF).

* RAG Pipeline: Reformulates user queries, then generates answers from relevant documents.

* Chat Management: JSON-based storage with rename and delete support.

* Diagram Support: Related images are automatically linked and sent to the frontend.

* Filtering: Answers are restricted to the Beko 300TR device only; queries about other brands/models are blocked.

------------------------ 

👉 This project aims to improve customer service efficiency and help users quickly resolve their own issues.