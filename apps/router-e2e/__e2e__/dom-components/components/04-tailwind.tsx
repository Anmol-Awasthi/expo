'use dom';

import * as Haptics from 'expo-haptics';

import '../global.css';

export default function Page(_: { dom?: import('expo/dom').DOMProps }) {
  return (
    <div className="bg-slate-100 rounded-xl">
      <p className="text-lg text-blue-400 font-medium">Welcome to Tailwind</p>
      <p className="text-lg text-blue-400 font-medium">
        {/* @ts-expect-error: ReactNativeWebView  */}
        DOM: {String(!!(typeof ReactNativeWebView !== 'undefined'))}
      </p>
      <button onClick={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}>
        Haptics
      </button>
    </div>
  );
}
