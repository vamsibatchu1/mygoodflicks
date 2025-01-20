// Firebase CRUD operations
// List management functions
// Real-time updates

import { db, auth } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  increment,
  orderBy,
  Timestamp,
  arrayUnion, 
  arrayRemove,
  getDoc,
  DocumentData,
  serverTimestamp
} from 'firebase/firestore'

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

interface CreateListParams {
  title: string
  isPublic: boolean
}

interface AddToListParams {
  listId: string
  mediaId: string
  mediaType: 'movie' | 'show'
  mediaTitle: string
  mediaPoster: string
}

// Add interface for list data
interface ListData {
  id: string;
  name: string;
  userId: string;
  isPrivate?: boolean;
  items: Array<any>;
  createdAt: any;
}

export const listsService = {
  // Create a new list
  async createList({ title, isPublic }: { title: string; isPublic: boolean }) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    
    const listData = {
      userId: user.uid,
      name: title,
      isPrivate: !isPublic,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      items: [],
      movieCount: 0,
      showCount: 0
    }

    const docRef = await addDoc(collection(db, 'lists'), listData)
    return docRef.id
  },

  // Get user's lists
  async getUserLists(userId: string): Promise<ListData[]> {
    if (!userId) throw new Error('User ID is required')

    const listsRef = collection(db, 'lists')
    const userListsQuery = query(
      listsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(userListsQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ListData[]
  },

  // Get all lists for a user
  //async getUserLists(userId: string): Promise<List[]> {
    //const q = query(
    //  collection(db, 'lists'),
      //where('userId', '==', userId)
    //)
    //const querySnapshot = await getDocs(q)
    //return querySnapshot.docs.map(doc => {
      //const data = doc.data() as DocumentData
      //return {
        //id: doc.id,
        //name: data.name,
        //userId: data.userId,
        //isPrivate: data.isPrivate,
        //items: data.items || [],
        //createdAt: data.createdAt?.toDate() || new Date(),
      //}
    //})
  //},

  // Get public lists
  async getPublicLists(): Promise<List[]> {
    const q = query(
      collection(db, 'lists'),
      where('isPrivate', '==', false)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData
      return {
        id: doc.id,
        name: data.name,
        userId: data.userId,
        isPrivate: data.isPrivate,
        items: data.items || [],
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })
  },

  // Add item to list
  async addToList(
    listId: string, 
    item: { 
      mediaId: string; 
      mediaType: string; 
      mediaTitle: string; 
      mediaPoster: string; 
    }
  ) {
    try {
      if (!auth.currentUser) {
        throw new Error('Not authenticated')
      }

      const listRef = doc(db, 'lists', listId)
      
      // Create the item object without serverTimestamp
      const listItem = {
        id: item.mediaId,
        type: item.mediaType,
        title: item.mediaTitle,
        posterPath: item.mediaPoster,
        addedAt: new Date().toISOString() // Use ISO string instead of serverTimestamp
      }

      // Update the document
      await updateDoc(listRef, {
        items: arrayUnion(listItem),
        updatedAt: serverTimestamp() // serverTimestamp is fine here
      })

      return true
    } catch (error) {
      console.error('Error in addToList:', error)
      throw error
    }
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
      collection(db, 'lists'),
      where('items', 'array-contains', { id: itemId })
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData
      return {
        id: doc.id,
        name: data.name,
        userId: data.userId,
        isPrivate: data.isPrivate,
        items: data.items || [],
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })
  },

  async getList(listId: string): Promise<List | null> {
    const docRef = doc(db, 'lists', listId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data() as DocumentData
      return {
        id: docSnap.id,
        name: data.name,
        userId: data.userId,
        isPrivate: data.isPrivate,
        items: data.items || [],
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    }
    return null
  }
};

// Add this function for testing
export const createTestList = async () => {
  try {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const testList = {
      title: 'Test List',
      isPublic: false
    }

    const listId = await listsService.createList(testList)
    console.log('Test list created:', listId)
    return listId
  } catch (error) {
    console.error('Error creating test list:', error)
    throw error
  }
} 