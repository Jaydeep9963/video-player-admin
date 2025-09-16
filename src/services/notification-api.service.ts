import { API_CONFIG } from "../config/api";
import { store } from '../store/store';

interface NotificationToken {
  token: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface NotificationTokensResponse {
  results: NotificationToken[];
  total: number;
}

interface SendNotificationRequest {
  data: {
    title: string;
    msg: string;
    notification_at?: string;
  };
}

interface SendNotificationResponse {
  message: string;
  data?: {
    totalSent: number;
    totalSuccess: number;
    totalFailure: number;
  };
}

class NotificationApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  // Get auth token dynamically from Redux store
  private getAuthToken(): string | null {
    const state = store.getState();
    return state.auth?.token || null;
  }

  // Updated headers to include latest token dynamically
  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Handle API response and errors
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch {
      throw new Error('Invalid JSON response from server');
    }
  }

  // Fetch all notification tokens
  public async getAllNotificationTokens(): Promise<NotificationTokensResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/notification/notification-tokens`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse<NotificationTokensResponse>(response);
    } catch (error) {
      console.error('Error fetching notification tokens:', error);
      throw error;
    }
  }

  // Send notification to all devices
  public async sendNotificationToAll(payload: SendNotificationRequest): Promise<SendNotificationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/notification/send-notification`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      return this.handleResponse<SendNotificationResponse>(response);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Optional: Send notification with custom data
  public async sendCustomNotification(payload: {
    title: string;
    msg: string;
    tokens?: string[];
    data?: Record<string, any>;
    notification_at?: string;
  }): Promise<SendNotificationResponse> {
    try {
      const requestPayload: SendNotificationRequest = {
        data: {
          title: payload.title,
          msg: payload.msg,
          notification_at: payload.notification_at,
        },
      };

      const response = await fetch(`${this.baseUrl}/admin/notification/send-notification`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(requestPayload),
      });

      return this.handleResponse<SendNotificationResponse>(response);
    } catch (error) {
      console.error('Error sending custom notification:', error);
      throw error;
    }
  }

  // Optional: Get notification history
  public async getNotificationHistory(page: number = 1, limit: number = 10): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/notification/history?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching notification history:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const notificationApiService = new NotificationApiService();
export default notificationApiService;

// Also export the class if needed
export { NotificationApiService };

// Export types
export type {
  NotificationToken,
  NotificationTokensResponse,
  SendNotificationRequest,
  SendNotificationResponse,
};
