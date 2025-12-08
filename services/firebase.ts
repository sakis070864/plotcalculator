import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ProjectInputs, SavedProject } from '../types';

// Configuration from your provided keys
const firebaseConfig = {
  apiKey: "AIzaSyAsoAmOPCduLxMCmxV7akQJDY9njmZSt2s",
  authDomain: "oikopedo-cc58b.firebaseapp.com",
  projectId: "oikopedo-cc58b",
  storageBucket: "oikopedo-cc58b.firebasestorage.app",
  messagingSenderId: "802024199226",
  appId: "1:802024199226:web:3f36609c7839316c995103"
};

let db: any;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

const COLLECTION_NAME = 'projects';

export const saveProject = async (name: string, inputs: ProjectInputs): Promise<SavedProject> => {
  if (!db) throw new Error("Database not initialized");
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      name,
      inputs,
      createdAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      name,
      inputs,
      createdAt: Date.now()
    };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getProjects = async (): Promise<SavedProject[]> => {
  if (!db) return []; // Return empty if db failed to load
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const projects: SavedProject[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        name: data.name,
        inputs: data.inputs,
        // Convert Firestore timestamp to JS number or use current time if missing
        createdAt: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now()
      });
    });
    
    return projects;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    throw e;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  if (!db) throw new Error("Database not initialized");
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};