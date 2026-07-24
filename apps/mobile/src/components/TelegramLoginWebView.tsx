import { StyleSheet, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import type { TelegramAuthData } from "@claudy-map/shared-types";
import { telegramLoginPageUrl } from "../lib/config";
import { colors } from "../theme";

interface Props {
  onAuth: (payload: TelegramAuthData) => void;
  onError: (message: string) => void;
}

function parsePayload(raw: string): TelegramAuthData | null {
  try {
    const u = JSON.parse(raw) as Record<string, unknown>;
    if (typeof u.id !== "number" || typeof u.hash !== "string") return null;
    return {
      id: u.id,
      first_name: String(u.first_name ?? ""),
      last_name: typeof u.last_name === "string" ? u.last_name : undefined,
      username: typeof u.username === "string" ? u.username : undefined,
      photo_url: typeof u.photo_url === "string" ? u.photo_url : undefined,
      auth_date: Number(u.auth_date ?? 0),
      hash: u.hash,
    };
  } catch {
    return null;
  }
}

/**
 * Renders the server-hosted Telegram Login Widget page in a WebView and
 * forwards the authorization payload back to the app.
 */
export function TelegramLoginWebView({ onAuth, onError }: Props) {
  const onMessage = (event: WebViewMessageEvent) => {
    const payload = parsePayload(event.nativeEvent.data);
    if (payload) {
      onAuth(payload);
    } else {
      onError("Не удалось разобрать ответ Telegram.");
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: telegramLoginPageUrl }}
        onMessage={onMessage}
        onError={() =>
          onError("Не удалось загрузить страницу входа Telegram.")
        }
        originWhitelist={["*"]}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
