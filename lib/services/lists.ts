// Firebase CRUD operations
// List management functions
// Real-time updates


import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  orderBy,
  Timestamp,
  arrayUnion,
  arrayRemove,
  getDoc
} from "firebase/firestore";
import type { List } from "@/types";

export interface MediaItem {
  id: string;
  type: 'movie' | 'show';
  title: string;
  posterPath?: string;
  addedAt: Date;
}

export interface List {
  id: string;
  name: string;
  userId: string;
  isPrivate: boolean;
  items: MediaItem[];
  createdAt: Date;
}

interface ListItem {
  id?: string;
  listId: string;
  itemId: string;
  type: 'movie' | 'show';
  addedAt: Date;
  posterPath?: string;
  title?: string;
}

export const listsService = {
  // Create a new list
  async createList(userId: string, name: string, isPrivate: boolean): Promise<string> {
    const docRef = await addDoc(collection(db, "lists"), {
      userId,
      name,
      isPrivate,
      items: [],
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Get all lists for a user
  async getUserLists(userId: string): Promise<List[]> {
    const q = query(
      collection(db, 'lists'),
      where('userId', '==', userId)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // Get public lists
  async getPublicLists(): Promise<List[]> {
    const q = query(
      collection(db, "lists"),
      where("isPrivate", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    const lists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      userId: doc.data().userId,
      movieCount: doc.data().movieCount || 0,
      showCount: doc.data().showCount || 0,
      isPrivate: false,
      createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000) : new Date(),
      lastUpdated: doc.data().lastUpdated ? new Date(doc.data().lastUpdated.seconds * 1000) : null,
    }));
    
    return lists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Add an item to a list
  async addItemToList(listId: string, item: Omit<MediaItem, 'addedAt'>): Promise<void> {
    const listRef = doc(db, "lists", listId);
    
    await updateDoc(listRef, {
      items: arrayUnion({
        ...item,
        addedAt: Timestamp.now()
      }),
      lastUpdated: Timestamp.now()
    });
  },

  // Remove an item from a list
  async removeItemFromList(listId: string, itemId: string, type: 'movie' | 'show'): Promise<void> {
    const listRef = doc(db, "lists", listId);
    const list = await getDocs(query(collection(db, "lists"), where("id", "==", listId)));
    const items = list.docs[0].data().items || [];
    const itemToRemove = items.find((i: MediaItem) => i.id === itemId);

    if (itemToRemove) {
      await updateDoc(listRef, {
        items: arrayRemove(itemToRemove),
        lastUpdated: Timestamp.now()
      });
    }
  },

  // Get all items in a list
  async getListItems(listId: string): Promise<ListItem[]> {
    const q = query(
      collection(db, "list-items"),
      where("listId", "==", listId),
      orderBy("addedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      addedAt: doc.data().addedAt.toDate(),
    } as ListItem));
  },

  // Delete a list and all its items
  async deleteList(listId: string): Promise<void> {
    // Delete all items in the list
    const q = query(
      collection(db, "list-items"),
      where("listId", "==", listId)
    );
    
    const querySnapshot = await getDocs(q);
    await Promise.all(
      querySnapshot.docs.map(doc => deleteDoc(doc.ref))
    );
    
    // Delete the list itself
    await deleteDoc(doc(db, "lists", listId));
  },

  // Update list privacy
  async updateListPrivacy(listId: string, isPrivate: boolean): Promise<void> {
    const listRef = doc(db, "lists", listId);
    await updateDoc(listRef, {
      isPrivate,
      lastUpdated: Timestamp.now()
    });
  },

  async getListsContainingItem(itemId: string): Promise<List[]> {
    const q = query(
      collection(db, "lists"),
      where("items", "array-contains", { id: itemId })
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      userId: doc.data().userId,
      movieCount: doc.data().movieCount || 0,
      showCount: doc.data().showCount || 0,
      isPrivate: doc.data().isPrivate ?? true,
      createdAt: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000) : new Date(),
      lastUpdated: doc.data().lastUpdated ? new Date(doc.data().lastUpdated.seconds * 1000) : null,
    }));
  },

  async getList(listId: string) {
    const docRef = doc(db, 'lists', listId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      }
    }
    return null
  }
}; 