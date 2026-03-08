import { StyleSheet, Platform } from 'react-native';

const PRIMARY_BLUE = '#5B9BFF';
const DARK_BLUE = '#2E5AA8';
const SUCCESS_GREEN = '#10B981';
const WARNING_ORANGE = '#F59E0B';
const ERROR_RED = '#EF4444';
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },

  formSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  listSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 12,
  },

  formCard: {
    backgroundColor: CARD_WHITE,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  addButton: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  addButtonText: {
    color: CARD_WHITE,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  emptyState: {
    backgroundColor: CARD_WHITE,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_DARK,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    textAlign: 'center',
    lineHeight: 20,
  },

  contactCard: {
    backgroundColor: CARD_WHITE,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  contactDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    backgroundColor: SUCCESS_GREEN,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButton: {
    backgroundColor: WARNING_ORANGE,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: ERROR_RED,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  infoSection: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_BLUE,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: TEXT_LIGHT,
    lineHeight: 20,
  },
});