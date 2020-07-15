import * as fetchMock from "fetch-mock";

import {
  getUserContent, IUserContentResponse, IUserContentRequestOptions
} from "../../src/items/content";

import { ItemSuccessResponse } from "../mocks/items/item";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { encodeParam } from "@esri/arcgis-rest-request";

describe("getContent", () => {
  afterEach(fetchMock.restore);

  describe("Authenticated methods", () => {
    const authentication = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
      username: "moses",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    const mockResponse: IUserContentResponse = {
      username: "geemike",
      total: 20,
      start: 1,
      num: 2,
      nextStart: 3,
      items: [
        {
          id: "1qwe",
          owner: "geemike",
          tags: [],
          created: 0,
          modified: 0,
          numViews: 0,
          size: 10,
          title: "Test Title #1",
          type: "CSV"
        },
        {
          id: "2asd",
          owner: "geemike",
          tags: [],
          created: 0,
          modified: 0,
          numViews: 0,
          size: 10,
          title: "Test Title #2",
          type: "CSV"
        }          
      ]
    };

    it("should get the user content defaulting the start and num parameters", done => {
      fetchMock.once("*", mockResponse);

      const requestOptions: IUserContentRequestOptions = {
        username: 'geemike',
        authentication
      };

      getUserContent(requestOptions).then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${requestOptions.username}?f=json&start=1&num=10&token=fake-token`
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should get the user content using the supplied start and num parameters", done => {
      fetchMock.once("*", mockResponse);

      const requestOptions: IUserContentRequestOptions = {
        username: 'geemike',
        start: 2,
        num: 1,
        authentication
      };

      getUserContent(requestOptions).then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/${requestOptions.username}?f=json&start=2&num=1&token=fake-token`
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });    
  });
});