import { View, ActivityIndicator } from 'react-native';
import { styles } from '../assets/styles/home.styles';
import { COLORS } from '../constants/colors';

/**
 * PageLoader shows a loading spinner centered on the page.
 */
const PageLoader = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

export default PageLoader;