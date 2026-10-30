import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestore-errors';
import {
  Course,
  CourseCategory,
  HeroSlide,
  WhyChooseUsItem,
  ServiceItem,
  ProjectItem,
  TeamMember,
  ResourceItem,
  BlogPost,
  SiteSettings,
  Enquiry
} from './types';
import {
  INITIAL_COURSES,
  INITIAL_CATEGORIES,
  INITIAL_HERO_SLIDES,
  INITIAL_WHY_CHOOSE_US,
  INITIAL_SERVICES,
  INITIAL_PROJECTS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_RESOURCES,
  INITIAL_BLOG_POSTS,
  INITIAL_SITE_SETTINGS
} from './seed-data';

/**
 * Recursively removes keys with undefined values to prevent Firestore
 * "Function setDoc() called with invalid data. Unsupported field value: undefined" errors.
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      result[key] = sanitizeForFirestore(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

/**
 * Wraps a Firestore query in a 2500ms race timeout to guarantee
 * instantaneous response and eliminate page stalls even on slow/offline connections.
 */
function fetchWithTimeout<T>(fetchPromise: Promise<T>, timeoutMs = 2500): Promise<T> {
  return Promise.race([
    fetchPromise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore request timed out')), timeoutMs)
    )
  ]);
}

// ==================== SEED / BOOTSTRAP ====================

export async function seedInitialDatabaseIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    if (!coursesSnapshot.empty) {
      return { seeded: false, message: 'Database already has records.' };
    }

    const batch = writeBatch(db);

    // Seed Courses
    INITIAL_COURSES.forEach((course, idx) => {
      const docRef = doc(collection(db, 'courses'));
      batch.set(docRef, { ...course, id: docRef.id });
    });

    // Seed Categories
    INITIAL_CATEGORIES.forEach((cat) => {
      const docRef = doc(collection(db, 'courseCategories'));
      batch.set(docRef, { ...cat, id: docRef.id });
    });

    // Seed Hero Slides
    INITIAL_HERO_SLIDES.forEach((slide) => {
      const docRef = doc(collection(db, 'heroSlides'));
      batch.set(docRef, { ...slide, id: docRef.id });
    });

    // Seed Why Choose Us
    INITIAL_WHY_CHOOSE_US.forEach((item) => {
      const docRef = doc(collection(db, 'whyChooseUs'));
      batch.set(docRef, { ...item, id: docRef.id });
    });

    // Seed Services
    INITIAL_SERVICES.forEach((service) => {
      const docRef = doc(collection(db, 'services'));
      batch.set(docRef, { ...service, id: docRef.id });
    });

    // Seed Projects
    INITIAL_PROJECTS.forEach((proj) => {
      const docRef = doc(collection(db, 'projects'));
      batch.set(docRef, { ...proj, id: docRef.id });
    });

    // Seed Team Members
    INITIAL_TEAM_MEMBERS.forEach((member) => {
      const docRef = doc(collection(db, 'teamMembers'));
      batch.set(docRef, { ...member, id: docRef.id });
    });

    // Seed Resources
    INITIAL_RESOURCES.forEach((res) => {
      const docRef = doc(collection(db, 'resources'));
      batch.set(docRef, { ...res, id: docRef.id });
    });

    // Seed Blog Posts
    INITIAL_BLOG_POSTS.forEach((post) => {
      const docRef = doc(collection(db, 'blogPosts'));
      batch.set(docRef, { ...post, id: docRef.id });
    });

    // Seed Settings
    const settingsRef = doc(db, 'siteSettings', 'general');
    batch.set(settingsRef, INITIAL_SITE_SETTINGS);

    await batch.commit();
    return { seeded: true, message: 'All Navioraa initial database collections seeded successfully.' };
  } catch (error) {
    console.error('Seed error:', error);
    return { seeded: false, message: error instanceof Error ? error.message : 'Failed to seed database' };
  }
}

// ==================== HERO SLIDES ====================

export async function getHeroSlides(publishedOnly = true): Promise<HeroSlide[]> {
  try {
    const colRef = collection(db, 'heroSlides');
    const q = publishedOnly 
      ? query(colRef, where('published', '==', true))
      : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_HERO_SLIDES.map((s, i) => ({ ...s, id: `seed-slide-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as HeroSlide));
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.warn('Falling back to local hero slides:', error);
    return INITIAL_HERO_SLIDES.map((s, i) => ({ ...s, id: `seed-slide-${i}` }));
  }
}

export async function saveHeroSlide(slide: Partial<HeroSlide> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'heroSlides');
  const docRef = slide.id ? doc(colRef, slide.id) : doc(colRef);
  const now = new Date().toISOString();
  const data = sanitizeForFirestore({
    ...slide,
    id: docRef.id,
    displayOrder: slide.displayOrder ?? 1,
    published: slide.published ?? true,
    updatedAt: now,
    createdAt: slide.createdAt || now,
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `heroSlides/${docRef.id}`);
  }
}

export async function deleteHeroSlide(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'heroSlides', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `heroSlides/${id}`);
  }
}

// ==================== COURSES ====================

export async function getCourses(publishedOnly = true): Promise<Course[]> {
  try {
    const colRef = collection(db, 'courses');
    const q = publishedOnly 
      ? query(colRef, where('published', '==', true))
      : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_COURSES.map((c, i) => ({ ...c, id: `seed-course-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as Course));
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.warn('Falling back to initial courses:', error);
    return INITIAL_COURSES.map((c, i) => ({ ...c, id: `seed-course-${i}` }));
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const q = query(collection(db, 'courses'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { ...d.data(), id: d.id } as Course;
    }
    const fallback = INITIAL_COURSES.find(c => c.slug === slug);
    return fallback ? { ...fallback, id: 'seed-' + slug } : null;
  } catch (error) {
    console.warn('Error fetching course by slug:', error);
    const fallback = INITIAL_COURSES.find(c => c.slug === slug);
    return fallback ? { ...fallback, id: 'seed-' + slug } : null;
  }
}

export async function saveCourse(course: Partial<Course> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'courses');
  const docRef = course.id ? doc(colRef, course.id) : doc(colRef);
  const now = new Date().toISOString();
  const data = sanitizeForFirestore({
    ...course,
    id: docRef.id,
    displayOrder: course.displayOrder ?? 1,
    published: course.published ?? true,
    updatedAt: now,
    createdAt: course.createdAt || now,
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courses/${docRef.id}`);
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courses', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courses/${id}`);
  }
}

// ==================== COURSE CATEGORIES ====================

export async function getCategories(activeOnly = true): Promise<CourseCategory[]> {
  try {
    const colRef = collection(db, 'courseCategories');
    const q = activeOnly ? query(colRef, where('active', '==', true)) : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && activeOnly) {
      return INITIAL_CATEGORIES.map((c, i) => ({ ...c, id: `seed-cat-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as CourseCategory));
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.warn('Fallback to initial categories:', error);
    return INITIAL_CATEGORIES.map((c, i) => ({ ...c, id: `seed-cat-${i}` }));
  }
}

export async function saveCategory(category: Partial<CourseCategory> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'courseCategories');
  const docRef = category.id ? doc(colRef, category.id) : doc(colRef);
  const data = sanitizeForFirestore({
    ...category,
    id: docRef.id,
    active: category.active ?? true,
    createdAt: category.createdAt || new Date().toISOString(),
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `courseCategories/${docRef.id}`);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'courseCategories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `courseCategories/${id}`);
  }
}

// ==================== WHY CHOOSE US ====================

export async function getWhyChooseUs(publishedOnly = true): Promise<WhyChooseUsItem[]> {
  try {
    const colRef = collection(db, 'whyChooseUs');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_WHY_CHOOSE_US.map((item, i) => ({ ...item, id: `seed-why-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as WhyChooseUsItem));
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    return INITIAL_WHY_CHOOSE_US.map((item, i) => ({ ...item, id: `seed-why-${i}` }));
  }
}

export async function saveWhyChooseUs(item: Partial<WhyChooseUsItem> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'whyChooseUs');
  const docRef = item.id ? doc(colRef, item.id) : doc(colRef);
  const data = sanitizeForFirestore({
    ...item,
    id: docRef.id,
    displayOrder: item.displayOrder ?? 1,
    published: item.published ?? true,
    createdAt: item.createdAt || new Date().toISOString(),
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `whyChooseUs/${docRef.id}`);
  }
}

export async function deleteWhyChooseUs(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'whyChooseUs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `whyChooseUs/${id}`);
  }
}

// ==================== SERVICES ====================

export async function getServices(publishedOnly = true): Promise<ServiceItem[]> {
  try {
    const colRef = collection(db, 'services');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_SERVICES.map((s, i) => ({ ...s, id: `seed-serv-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as ServiceItem));
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    return INITIAL_SERVICES.map((s, i) => ({ ...s, id: `seed-serv-${i}` }));
  }
}

export async function saveService(service: Partial<ServiceItem> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'services');
  const docRef = service.id ? doc(colRef, service.id) : doc(colRef);
  const now = new Date().toISOString();
  const data = sanitizeForFirestore({
    ...service,
    id: docRef.id,
    displayOrder: service.displayOrder ?? 1,
    published: service.published ?? true,
    updatedAt: now,
    createdAt: service.createdAt || now,
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `services/${docRef.id}`);
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
  }
}

// ==================== PROJECTS ====================

export async function getProjects(publishedOnly = true): Promise<ProjectItem[]> {
  try {
    const colRef = collection(db, 'projects');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `seed-proj-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as ProjectItem));
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    return INITIAL_PROJECTS.map((p, i) => ({ ...p, id: `seed-proj-${i}` }));
  }
}

export async function saveProject(project: Partial<ProjectItem> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'projects');
  const docRef = project.id ? doc(colRef, project.id) : doc(colRef);
  const now = new Date().toISOString();
  const data = sanitizeForFirestore({
    ...project,
    id: docRef.id,
    displayOrder: project.displayOrder ?? 1,
    published: project.published ?? true,
    updatedAt: now,
    createdAt: project.createdAt || now,
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `projects/${docRef.id}`);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
  }
}

// ==================== TEAM MEMBERS ====================

export async function getTeamMembers(publishedOnly = true): Promise<TeamMember[]> {
  try {
    const colRef = collection(db, 'teamMembers');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_TEAM_MEMBERS.map((m, i) => ({ ...m, id: `seed-team-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as TeamMember));
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    return INITIAL_TEAM_MEMBERS.map((m, i) => ({ ...m, id: `seed-team-${i}` }));
  }
}

export async function saveTeamMember(member: Partial<TeamMember> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'teamMembers');
  const docRef = member.id ? doc(colRef, member.id) : doc(colRef);
  const now = new Date().toISOString();
  const data = sanitizeForFirestore({
    ...member,
    id: docRef.id,
    order: member.order ?? 1,
    published: member.published ?? true,
    updatedAt: now,
    createdAt: member.createdAt || now,
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `teamMembers/${docRef.id}`);
  }
}

export async function deleteTeamMember(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'teamMembers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `teamMembers/${id}`);
  }
}

// ==================== RESOURCES ====================

export async function getResources(publishedOnly = true): Promise<ResourceItem[]> {
  try {
    const colRef = collection(db, 'resources');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_RESOURCES.map((r, i) => ({ ...r, id: `seed-res-${i}` }));
    }
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as ResourceItem));
    return items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    return INITIAL_RESOURCES.map((r, i) => ({ ...r, id: `seed-res-${i}` }));
  }
}

export async function saveResource(res: Partial<ResourceItem> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'resources');
  const docRef = res.id ? doc(colRef, res.id) : doc(colRef);
  const data = sanitizeForFirestore({
    ...res,
    id: docRef.id,
    displayOrder: res.displayOrder ?? 1,
    published: res.published ?? true,
    createdAt: res.createdAt || new Date().toISOString(),
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `resources/${docRef.id}`);
  }
}

export async function deleteResource(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'resources', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `resources/${id}`);
  }
}

// ==================== BLOG POSTS ====================

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  try {
    const colRef = collection(db, 'blogPosts');
    const q = publishedOnly ? query(colRef, where('published', '==', true)) : colRef;
    const snap = await fetchWithTimeout(getDocs(q), 2000);
    if (snap.empty && publishedOnly) {
      return INITIAL_BLOG_POSTS.map((b, i) => ({ ...b, id: `seed-blog-${i}` }));
    }
    return snap.docs.map(d => {
      const postData = d.data() as BlogPost;
      const rawAuthor = postData.author || '';
      const cleanAuthor = (rawAuthor.toLowerCase().includes('sakshi') || rawAuthor.toLowerCase().includes('sandip'))
        ? 'NAVIORAA Technical Faculty'
        : (rawAuthor || 'NAVIORAA Technical Faculty');

      let coverImage = postData.coverImage || '';
      if (!coverImage || coverImage.includes('photo-1677442136019-21780efad99a') || postData.slug === 'applied-ai-llm-rag-systems') {
        coverImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80';
      }

      return { ...postData, author: cleanAuthor, coverImage, id: d.id };
    });
  } catch (error) {
    return INITIAL_BLOG_POSTS.map((b, i) => ({ ...b, id: `seed-blog-${i}` }));
  }
}

export async function saveBlogPost(post: Partial<BlogPost> & { id?: string }): Promise<string> {
  const colRef = collection(db, 'blogPosts');
  const docRef = post.id ? doc(colRef, post.id) : doc(colRef);
  const now = new Date().toISOString();
  const rawAuthor = post.author || '';
  const cleanAuthor = (rawAuthor.toLowerCase().includes('sakshi') || rawAuthor.toLowerCase().includes('sandip'))
    ? 'NAVIORAA Technical Faculty'
    : (rawAuthor || 'NAVIORAA Technical Faculty');

  const data = sanitizeForFirestore({
    ...post,
    id: docRef.id,
    author: cleanAuthor,
    published: post.published ?? true,
    updatedAt: now,
    createdAt: post.createdAt || now,
    publishedAt: post.publishedAt || (post.published ? now : undefined),
  });
  try {
    await setDoc(docRef, data, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blogPosts/${docRef.id}`);
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'blogPosts', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `blogPosts/${id}`);
  }
}

// ==================== SITE SETTINGS ====================

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await fetchWithTimeout(getDoc(doc(db, 'siteSettings', 'general')), 2000);
    if (snap.exists()) {
      const data = snap.data() as SiteSettings;
      const contactPhone =
        !data.contactPhone || data.contactPhone === '+91 98765 43210'
          ? '+91 9890187383'
          : data.contactPhone;
      const whatsappNumber =
        !data.whatsappNumber || data.whatsappNumber === '+919876543210'
          ? '+919890187383'
          : data.whatsappNumber;

      return {
        ...INITIAL_SITE_SETTINGS,
        ...data,
        contactPhone,
        whatsappNumber,
        address: '', // Strict requirement: remove address completely across the site
      };
    }
    return INITIAL_SITE_SETTINGS;
  } catch (error) {
    return INITIAL_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, 'siteSettings', 'general');
    const cleanSettings = sanitizeForFirestore({ ...settings, updatedAt: new Date().toISOString() });
    await setDoc(docRef, cleanSettings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'siteSettings/general');
  }
}

export async function createEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt'>): Promise<{ id: string; emailNotificationSent: boolean; message: string }> {
  const colRef = collection(db, 'enquiries');
  const docRef = doc(colRef);
  const now = new Date().toISOString();

  let emailDelivered = false;
  let emailStatusNote = '';

  try {
    const apiRes = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...enquiry, enquiryId: docRef.id }),
    });

    const apiData = await apiRes.json().catch(() => ({}));

    if (apiRes.status === 400 && apiData.error) {
      // Client validation error from server
      throw new Error(apiData.error);
    }

    if (apiRes.ok && apiData.success) {
      emailDelivered = Boolean(apiData.emailDelivered);
      emailStatusNote = apiData.emailMessage || '';
    } else {
      emailDelivered = false;
      emailStatusNote = apiData.error || `Server responded with status ${apiRes.status}`;
    }
  } catch (err) {
    if (err instanceof Error && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
      throw err;
    }
    console.info('Server email endpoint notice:', err);
    emailDelivered = false;
    emailStatusNote = 'Email provider unconfigured';
  }

  // Persist record to Firestore database with NO undefined properties
  const record: Record<string, any> = {
    id: docRef.id,
    fullName: enquiry.fullName,
    email: enquiry.email,
    phone: enquiry.phone,
    programOrService: enquiry.programOrService,
    message: enquiry.message,
    status: 'new',
    emailNotificationSent: emailDelivered,
    createdAt: now,
    updatedAt: now,
  };

  if (enquiry.subject) {
    record.subject = enquiry.subject;
  }
  if (!emailDelivered && emailStatusNote) {
    record.emailError = emailStatusNote;
  }

  const cleanRecord = sanitizeForFirestore(record);

  try {
    await fetchWithTimeout(setDoc(docRef, cleanRecord), 3000);
  } catch (error) {
    console.warn('Firestore database write notice for enquiry:', error);
    if (!emailDelivered) {
      handleFirestoreError(error, OperationType.CREATE, `enquiries/${docRef.id}`);
    }
  }

  const userFeedbackMessage = emailDelivered
    ? `Enquiry received! Confirmation notification delivered to admissions.`
    : `Enquiry received successfully! Our academic mentors will contact you within 2 working hours.`;

  return {
    id: docRef.id,
    emailNotificationSent: emailDelivered,
    message: userFeedbackMessage,
  };
}

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    const snap = await getDocs(collection(db, 'enquiries'));
    const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as Enquiry));
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'enquiries');
  }
}

export async function updateEnquiryStatus(
  id: string,
  updates: Partial<Pick<Enquiry, 'status' | 'assignedTo' | 'internalNotes' | 'followUpDate'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'enquiries', id);
    const cleanUpdates = sanitizeForFirestore({ ...updates, updatedAt: new Date().toISOString() });
    await setDoc(docRef, cleanUpdates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `enquiries/${id}`);
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'enquiries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `enquiries/${id}`);
  }
}
