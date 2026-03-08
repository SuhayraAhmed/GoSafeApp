import { StyleSheet } from 'react-native';

const BLUE = '#5B9BFF';
const TEXT = '#0E1726';

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },

  hero: {
    height: 170,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center', // Centrera vertikalt
    alignItems: 'center',
    marginTop: -40, // Flytta upp innehållet lite
  },

  welcomeLine1: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT,
    textAlign: 'center',
  },
  welcomeLine2: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT,
    textAlign: 'center',
    marginBottom: 32, // Mer marginal för bättre spacing
  },

  primaryButton: {
    width: '100%', // Tar full bredd med padding
    height: 48,
    backgroundColor: BLUE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 6,
  },
  primaryButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700' 
  },

  orText: { 
    marginVertical: 24, // Mer spacing runt "or"
    color: '#6B7280',
    fontSize: 14,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 8,
  },
  socialBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});