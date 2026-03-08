import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PRIMARY_BLUE = '#5B9BFF';
const DARK_BLUE = '#2E5AA8';
const LIGHT_BLUE = '#EFF6FF';
const TEXT_DARK = '#1E293B';
const TEXT_LIGHT = '#64748B';
const LIGHT_BG = '#F8FAFC';
const CARD_WHITE = '#FFFFFF';
const BORDER_COLOR = '#E2E8F0';

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: LIGHT_BG 
  },

  scrollView: {
    flex: 1,
  },

  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#11181C',
  },

  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  map: {
    width: '100%',
    height: '100%',
  },

  loadingContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: '500',
  },

  errorContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: CARD_WHITE,
    fontWeight: '600',
    fontSize: 14,
  },

  mainContent: {
    padding: 16,
  },

  welcomeCard: {
    backgroundColor: CARD_WHITE,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: '500',
  },

  walkButton: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: DARK_BLUE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  walkButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  walkButtonText: {
    color: CARD_WHITE,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  walkButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },

  quickActionsSection: {
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: CARD_WHITE,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: TEXT_LIGHT,
    lineHeight: 16,
  },
});