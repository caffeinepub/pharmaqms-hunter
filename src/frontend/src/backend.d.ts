import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Job {
    id: bigint;
    title: string;
    source: JobSource;
    postedTime: Time;
    description: string;
    company: string;
    location: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    email: string;
    preferredLocations: Array<string>;
}
export enum JobSource {
    linkedin = "linkedin",
    other = "other",
    indeed = "indeed",
    workday = "workday",
    companySite = "companySite"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addJob(title: string, company: string, location: string, description: string, source: JobSource): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllJobsIds(): Promise<Array<bigint>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getJob(id: bigint): Promise<Job>;
    getSavedJobIds(): Promise<Array<bigint>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveJob(jobId: bigint): Promise<void>;
    searchJobs(searchTerm: string, location: string): Promise<Array<bigint>>;
    shouldIncludeJob(company: string, jobTitle: string, location: string): Promise<boolean>;
}
