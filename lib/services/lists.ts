import { db } from "@/lib/firebase";
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
} from "firebase/firestore";

interface List {
  id?: string;
  name: string;
  userId: string;
  movieCount: number;
  showCount: number;
  createdAt: Date;
  isPrivate: boolean;
  lastUpdated?: Date;
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
    const newList: Omit<List, 'id'> = {
      name,
      userId,
      movieCount: 0,
      showCount: 0,
      createdAt: new Date(),
      lastUpdated: new Date(),
      isPrivate,
    };
    
    const docRef = await addDoc(collection(db, "lists"), newList);
    return docRef.id;
  },

  // Get all lists for a user
  async getUserLists(userId: string): Promise<List[]> {
    try {
      console.log("getUserLists called with userId:", userId);
      
      const listsRef = collection(db, "lists");
      // Simplified query without ordering until index is ready
      const q = query(
        listsRef,
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const lists = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          userId: data.userId,
          movieCount: data.movieCount || 0,
          showCount: data.showCount || 0,
          isPrivate: data.isPrivate ?? true,
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated.seconds * 1000) : null,
        } as List;
      });
      
      // Sort in memory temporarily
      return lists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error in getUserLists:", error);
      throw error;
    }
  },

  // Get public lists
  async getPublicLists(): Promise<List[]> {
    try {
      const listsRef = collection(db, "lists");
      // Simplified query without ordering until index is ready
      const q = query(
        listsRef,
        where("isPrivate", "==", false)
      );
      
      const querySnapshot = await getDocs(q);
      const lists = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          userId: data.userId,
          movieCount: data.movieCount || 0,
          showCount: data.showCount || 0,
          isPrivate: false,
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
          lastUpdated: data.lastUpdated ? new Date(data.lastUpdated.seconds * 1000) : null,
        } as List;
      });
      
      // Sort in memory temporarily
      return lists.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error in getPublicLists:", error);
      throw error;
    }
  },

  // Add an item to a list
  async addItemToList(
    listId: string, 
    itemId: string, 
    type: 'movie' | 'show',
    posterPath?: string,
    title?: string
  ): Promise<void> {
    const newItem: Omit<ListItem, 'id'> = {
      listId,
      itemId,
      type,
      addedAt: new Date(),
      posterPath,
      title,
    };
    
    // Add item to list-items collection
    await addDoc(collection(db, "list-items"), newItem);
    
    // Update count and lastUpdated in the list document
    const listRef = doc(db, "lists", listId);
    await updateDoc(listRef, {
      [`${type}Count`]: increment(1),
      lastUpdated: new Date()
    });
  },

  // Remove an item from a list
  async removeItemFromList(listId: string, itemId: string, type: 'movie' | 'show'): Promise<void> {
    // Find and delete the list-item
    const q = query(
      collection(db, "list-items"),
      where("listId", "==", listId),
      where("itemId", "==", itemId)
    );
    
    const querySnapshot = await getDocs(q);
    const itemDoc = querySnapshot.docs[0];
    if (itemDoc) {
      await deleteDoc(doc(db, "list-items", itemDoc.id));
      
      // Update count and lastUpdated in the list document
      const listRef = doc(db, "lists", listId);
      await updateDoc(listRef, {
        [`${type}Count`]: increment(-1),
        lastUpdated: new Date()
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
      lastUpdated: new Date()
    });
  }
}; 