export const colors = {
  primary: '#2A9D8F',
  primarySoft: '#E8F5F3',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#2B2D42',
  textSecondary: '#8D99AE',
  border: '#E9ECEF',
  error: '#E85D75',
};

export const spacing = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: '#2A9D8F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  h2: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  h3: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  body: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
};
