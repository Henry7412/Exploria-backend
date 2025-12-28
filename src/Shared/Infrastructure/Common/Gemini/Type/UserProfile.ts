export interface UserProfile {
  name: string;
  interest: string[];
  hobbies: string;
  languages: string[];
  aboutMe: string;
  age: number | null;
  nationality: string;
  medicalConsiderations?: string;
  funFact?: string;
  jobTitle?: string;
  favoriteFoods?: string;
  voiceTones?: string[];
  perspectives?: string[];
}
