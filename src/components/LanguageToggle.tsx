import { TouchableOpacity, Text, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Updates from 'expo-updates';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const currentLang = i18n.language;
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    const isRTL = nextLang === 'ar';

    await i18n.changeLanguage(nextLang);
    
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      // In Expo Go, Updates.reloadAsync() might not work as expected or might be needed.
      // For a real app, a restart is needed.
      // We will try to just change language for now, layout might need restart.
      try {
          await Updates.reloadAsync();
      } catch (e) {
          console.log("Reload not supported in this environment");
      }
    }
  };

  return (
    <TouchableOpacity onPress={toggleLanguage} className="mr-4 px-3 py-1 bg-slate-100 rounded-full">
      <Text className="text-sm font-bold text-slate-700">
        {i18n.language === 'en' ? 'عربي' : 'English'}
      </Text>
    </TouchableOpacity>
  );
};