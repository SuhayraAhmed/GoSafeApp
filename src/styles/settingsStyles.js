import { StyleSheet } from 'react-native';

const BLUE = '#5B9BFF';
const TEXT = '#0E1726';
const GRAY = '#6B7280';
const LIGHT_GRAY = '#E5E7EB';
const BORDER_GRAY = '#F3F4F6';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT,
  },
  menu: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_GRAY,
  },
  menuText: {
    fontSize: 16,
    color: TEXT,
    marginLeft: 12,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  navText: {
    fontSize: 12,
    color: GRAY,
    marginTop: 4,
  },
  navTextActive: {
    color: BLUE,
    fontWeight: '600',
  },
});