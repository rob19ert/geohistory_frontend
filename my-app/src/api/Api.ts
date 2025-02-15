/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Discoverers {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /**
   * Bio
   * @minLength 1
   */
  bio?: string;
  /**
   * Long description
   * @minLength 1
   */
  long_description?: string;
  /** Status */
  status?: "active" | "deleted";
  /**
   * Image url
   * @format uri
   * @minLength 1
   */
  image_url?: string | null;
  /**
   * Years of life
   * @minLength 1
   * @maxLength 50
   */
  years_of_life?: string;
  /**
   * Nationality
   * @minLength 1
   * @maxLength 100
   */
  nationality?: string;
  /**
   * Major discovery
   * @minLength 1
   * @maxLength 255
   */
  major_discovery?: string;
}

export interface Discovery {
  /** ID */
  id?: number;
  /** Status */
  status: "draft" | "deleted" | "formed" | "completed" | "rejected";
  /** Created at */
  created_at?: string;
  /** Formed at */
  formed_at?: string;
  /** Completed at */
  completed_at?: string;
  /**
   * Creator login
   * @minLength 1
   */
  creator_login?: string;
  /**
   * Moderator login
   * @minLength 1
   */
  moderator_login?: string | null;
  /**
   * Region
   * @minLength 1
   * @maxLength 255
   */
  region: string;
  discoverers?: Discoverers[];
  /** Qr */
  qr?: string | null;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * Password
   * @minLength 1
   * @maxLength 128
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

export interface UserUpdate {
  /** ID */
  id?: number;
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string;
  /**
   * First name
   * @maxLength 150
   */
  first_name?: string;
  /**
   * Last name
   * @maxLength 150
   */
  last_name?: string;
  /**
   * Staff status
   * Designates whether the user can log into this admin site.
   */
  is_staff?: boolean;
  /**
   * Password
   * @minLength 1
   * @maxLength 128
   */
  password?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000", withCredentials: true });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Geographical Discoveries API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000
 * @contact <contact@geodiscoveries.com>
 *
 * API for managing geographical discoveries and explorers
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoverersList
     * @summary Получить список первооткрывателей
     * @request GET:/api/discoverers/
     * @secure
     */
    apiDiscoverersList: (
      query?: {
        /** Имя первооткрывателя */
        name?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Discoverers[], any>({
        path: `/discoverers/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoverersCreate
     * @summary Создать первооткрывателя
     * @request POST:/api/discoverers/
     * @secure
     */
    apiDiscoverersCreate: (data: Discoverers, params: RequestParams = {}) =>
      this.request<Discoverers, void>({
        path: `/discoverers/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoverersRead
     * @summary Получить первооткрывателя
     * @request GET:/api/discoverers/{id}/
     * @secure
     */
    apiDiscoverersRead: (id: string, params: RequestParams = {}) =>
      this.request<Discoverers, void>({
        path: `/discoverers/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoverersUpdate
     * @summary Обновить данные первооткрывателя
     * @request PUT:/api/discoverers/{id}/
     * @secure
     */
    apiDiscoverersUpdate: (id: string, data: Discoverers, params: RequestParams = {}) =>
      this.request<Discoverers, void>({
        path: `/discoverers/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoverersDelete
     * @summary Удалить первооткрывателя
     * @request DELETE:/api/discoverers/{id}/
     * @secure
     */
    apiDiscoverersDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/discoverers/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Upload or update an image for a discoverer
     *
     * @tags api
     * @name ApiDiscoverersUploadImageCreate
     * @request POST:/api/discoverers/{id}/upload-image/
     * @secure
     */
    apiDiscoverersUploadImageCreate: (id: string, pk: number, data: Discoverers, params: RequestParams = {}) =>
      this.request<Discoverers, void>({
        path: `/discoverers/${id}/upload-image/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoveriesList
     * @summary Получить список открытий
     * @request GET:/api/discoveries/
     * @secure
     */
    apiDiscoveriesList: (
      query?: {
        /** Фильтрация по статусу открытия */
        status?: string;
        /**
         * Фильтрация по начальной дате
         * @format date
         */
        start_date?: string;
        /**
         * Фильтрация по конечной дате
         * @format date
         */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Discovery[], void>({
        path: `/discoveries/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавление исследователя в черновик
     *
     * @tags api
     * @name ApiDiscoveriesAddDiscovererCreate
     * @request POST:/api/discoveries/add-discoverer/
     * @secure
     */
    apiDiscoveriesAddDiscovererCreate: (
      data: {
        /** ID исследователя */
        explorer_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/discoveries/add-discoverer/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoveriesExplorersRemoveDelete
     * @request DELETE:/api/discoveries/{discovery_id}/explorers/{discoverer_id}/remove/
     * @secure
     */
    apiDiscoveriesExplorersRemoveDelete: (discoveryId: string, discovererId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/discoveries/${discoveryId}/explorers/${discovererId}/remove/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoveriesExplorersUpdateUpdate
     * @request PUT:/api/discoveries/{discovery_id}/explorers/{discoverer_id}/update/
     * @secure
     */
    apiDiscoveriesExplorersUpdateUpdate: (discoveryId: string, discovererId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/discoveries/${discoveryId}/explorers/${discovererId}/update/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiDiscoveriesRead
     * @summary Создать открытие
     * @request GET:/api/discoveries/{id}/
     * @secure
     */
    apiDiscoveriesRead: (id: string, params: RequestParams = {}) =>
      this.request<Discovery, void>({
        path: `/discoveries/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Update a specific disability request (only 'draft' status can be updated).
     *
     * @tags api
     * @name ApiDiscoveriesUpdate
     * @request PUT:/api/discoveries/{id}/
     * @secure
     */
    apiDiscoveriesUpdate: (id: string, data: Discovery, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/discoveries/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Soft delete a specific disability request (marks it as 'deleted').
     *
     * @tags api
     * @name ApiDiscoveriesDelete
     * @request DELETE:/api/discoveries/{id}/
     * @secure
     */
    apiDiscoveriesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/discoveries/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Complete or reject a disability request. Based on the action parameter, update the status to 'completed' or 'rejected'.
     *
     * @tags api
     * @name ApiDiscoveriesCompleteOrRejectUpdate
     * @request PUT:/api/discoveries/{id}/complete_or_reject/
     * @secure
     */
    apiDiscoveriesCompleteOrRejectUpdate: (
      id: string,
      data: Discovery,
      query?: {
        /** Action to perform, either 'completed' or 'rejected'. */
        action?: "completed" | "rejected";
      },
      params: RequestParams = {},
    ) =>
      this.request<Discovery, void>({
        path: `/discoveries/${id}/complete_or_reject/`,
        method: "PUT",
        query: query,
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Submit a disability request, updating its status to 'formed' and setting the data_compilation date.
     *
     * @tags api
     * @name ApiDiscoveriesSubmitUpdate
     * @request PUT:/api/discoveries/{id}/submit/
     * @secure
     */
    apiDiscoveriesSubmitUpdate: (id: string, data: Discovery, params: RequestParams = {}) =>
      this.request<Discovery, void>({
        path: `/discoveries/${id}/submit/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiLoginCreate
     * @request POST:/api/login/
     * @secure
     */
    apiLoginCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUpdateProfileUpdate
     * @request PUT:/api/update-profile/
     * @secure
     */
    apiUpdateProfileUpdate: (data: UserUpdate, params: RequestParams = {}) =>
      this.request<UserUpdate, any>({
        path: `/update-profile/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUpdateProfilePartialUpdate
     * @request PATCH:/api/update-profile/
     * @secure
     */
    apiUpdateProfilePartialUpdate: (data: UserUpdate, params: RequestParams = {}) =>
      this.request<UserUpdate, any>({
        path: `/update-profile/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUsersList
     * @request GET:/api/users/
     * @secure
     */
    apiUsersList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/users/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUsersCreate
     * @request POST:/api/users/
     * @secure
     */
    apiUsersCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUsersRead
     * @request GET:/api/users/{id}/
     * @secure
     */
    apiUsersRead: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUsersUpdate
     * @request PUT:/api/users/{id}/
     * @secure
     */
    apiUsersUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUsersPartialUpdate
     * @request PATCH:/api/users/{id}/
     * @secure
     */
    apiUsersPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags api
     * @name ApiUsersDelete
     * @request DELETE:/api/users/{id}/
     * @secure
     */
    apiUsersDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags logout
     * @name LogoutCreate
     * @request POST:/logout/
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}
