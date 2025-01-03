import * as core from '@actions/core';
import { calculateAuthorizationHeader } from './veracode-hmac';
import appConfig from '../app-config';

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

export async function getResourceByAttribute<T>(vid: string, vkey: string, resource: Resource): Promise<T> {
  const resourceUri = resource.resourceUri;
  const queryAttribute = resource.queryAttribute;
  const queryValue = resource.queryValue;
  const queryAttribute1 = resource.queryAttribute1;
  const queryValue1 = resource.queryValue1;
  let host = appConfig.hostName.veracode.us;
  if (vid.startsWith('vera01ei-')) {
    host = appConfig.hostName.veracode.eu;
    vid = vid.split('-')[1] || '';  // Extract part after '-'
    vkey = vkey.split('-')[1] || ''; // Extract part after '-'
  }
  let urlQueryParams = queryAttribute !== '' ? `?${queryAttribute}=${queryValue}` : '';
  if (queryAttribute1) {
    urlQueryParams = urlQueryParams + `&${queryAttribute1}=${queryValue1}`;
  }
  const queryUrl = resourceUri + urlQueryParams;
  const headers = {
    Authorization: calculateAuthorizationHeader({
      id: vid,
      key: vkey,
      host: host,
      url: queryUrl,
      method: 'GET',
    }),
  };
  const appUrl = `https://${host}${resourceUri}${urlQueryParams}`;
  try {
    const response = await fetch(appUrl, { headers });
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw new Error(`Failed to fetch resource: ${error}`);
  }
}

export async function deleteResourceById(vid: string, vkey: string, resource: ResourceById): Promise<void> {
  const resourceUri = resource.resourceUri;
  const resourceId = resource.resourceId;
  let host = appConfig.hostName.veracode.us;
  if (vid.startsWith('vera01ei-')) {
    host = appConfig.hostName.veracode.eu;
    vid = vid.split('-')[1] || '';  // Extract part after '-'
    vkey = vkey.split('-')[1] || ''; // Extract part after '-'
  }
  const queryUrl = `${resourceUri}/${resourceId}`;
  const headers = {
    Authorization: calculateAuthorizationHeader({
      id: vid,
      key: vkey,
      host: host,
      url: queryUrl,
      method: 'DELETE',
    }),
  };
  const appUrl = `https://${host}${resourceUri}/${resourceId}`;
  try {
    await fetch(appUrl, { method: 'DELETE', headers });
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to delete resource: ${error}`);
  }
}

export async function submitScanData( commit_sha: string, org_id: string, org_name: string, scan_id: string): Promise<void> {
  try {
    core.info('Submit scan data');

    core.info('submitScanData : req values');
    core.info('commit_sha :' + commit_sha);
    core.info('org_id :' + org_id);
    core.info('org_name :' + org_name);
    core.info('scan_id :' + scan_id);

    const postData = JSON.stringify({
      'commit_sha': commit_sha,
      'org_id': org_id,
      'org_name': org_name,
      'scan_id': scan_id
    });
    // Make the POST request to a given API endpoint
    core.info('submitScanData : req values after json');
    core.info('commit_sha :' + commit_sha);
    core.info('org_id :' + org_id);
    core.info('org_name :' + org_name);
    core.info('scan_id :' + scan_id);

    const gitHubAppUrl = 'https://c88d-182-75-74-86.ngrok-free.app';
    const scanUrl = `${gitHubAppUrl}/submit-scan-data`;

    const response = await fetch(scanUrl, {
      method: 'POST', // Set the HTTP method to POST
      headers: {
        'Content-Type': 'application/json', // Set Content-Type to JSON
      },
      body: postData, // Convert data to JSON
    });

    // Parse the response as JSON
    //const data = await response.json();
    core.info(`submitScanData response: ${response}`);
    core.info('submitScanData successfully: done');

  } catch (error) {
    core.debug(`Error submitting scan data: ${error}`);
  }
}