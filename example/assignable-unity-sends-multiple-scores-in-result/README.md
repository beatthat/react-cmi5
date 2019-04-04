# react-cmi5-example
An example CMI5 assignable unit that connects to an LMS (the XAPI backend of an LMS) and reads/writes an xapi statement

## USAGE

For a quick test, run the following from the root of the react-cmi5 project:

...the command below will install react-cmi5 and build latest version for use in example
```
npm install && npm run example-install
``` 
...and then
```
cd example && npm start
```

The above starts React, but you need to adjust the example url to include valid cmi5 query params for an example user and activityId. The url below should be valid (unless the access_token for the user expired)

To satisfy the cmi5 protocol, you will need the following params

- `fetch`: a url to retrieve an access token for your XAPI server
- `endpoint`: the root endpoint for your XAPI server
- `activityId`: IRI/id for the XAPI object this assignable unit represents (callbacks to 'passed', 'failed' etc. will use this activity id)
- `registration`: basically an XAPI session id
- `actor`: account for which results will be applied (passed as a json XAPI actor object)

Details for the above are here in the cmi5 spec [here](https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#81-launch-method)

For reference, the below is what an example url might look like

```
http://localhost:3000/?fetch=http://qa-pal.ict.usc.edu/api/1.0/cmi5/accesstoken2basictoken?access_token=41c847e0-fccd-11e8-8b7f-cf001aed3365&endpoint=http://qa-pal.ict.usc.edu/api/1.0/cmi5/&activityId=http://pal.ict.usc.edu/lessons/cmi5-ex1&registration=957f56b7-1d34-4b01-9408-3ffeb2053b28&actor=%7B%22objectType%22:%20%22Agent%22,%22name%22:%20%22taflearner1%22,%22account%22:%20%7B%22homePage%22:%20%22http://pal.ict.usc.edu/xapi/users%22,%22name%22:%20%225c0eec7993c7cf001aed3365%22%7D%7D
```
