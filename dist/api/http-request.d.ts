interface Resource {
    resourceUri: string;
    queryAttribute: string;
    queryValue: string;
    queryAttribute1?: string;
    queryValue1?: boolean;
}
interface ResourceById {
    resourceUri: string;
    resourceId: string;
}
export declare function getResourceByAttribute<T>(vid: string, vkey: string, resource: Resource): Promise<T>;
export declare function deleteResourceById(vid: string, vkey: string, resource: ResourceById): Promise<void>;
export declare function submitScanData(commit_sha: string, org_id: string, org_name: string, scan_id: string, source_repository: string): Promise<void>;
export {};
