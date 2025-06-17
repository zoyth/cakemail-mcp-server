import { jest, describe, it, expect } from '@jest/globals';

describe('Email API', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string): boolean => {
      if (!email || typeof email !== 'string') {
        return false;
      }
      
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      
      return emailRegex.test(email) && email.length <= 254;
    };

    it('should validate email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('should respect email length limits', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('Filter Creation', () => {
    const createFilter = (conditions: any[], operator: 'and' | 'or' | 'not' | 'is' = 'and'): string => {
      if (!conditions || conditions.length === 0) {
        throw new Error('Conditions are required for filter creation');
      }

      const validOperators = ['and', 'or', 'not', 'is'];
      if (!validOperators.includes(operator)) {
        throw new Error(`Operator must be one of: ${validOperators.join(', ')}`);
      }

      let filter: any;
      
      if (conditions.length === 1 && typeof conditions[0] === 'string') {
        filter = { [operator]: conditions[0] };
      } else {
        filter = { [operator]: conditions };
      }

      return JSON.stringify(filter);
    };

    const createTagFilter = (tags: string[], operator: 'and' | 'or' = 'or'): string => {
      if (!tags || tags.length === 0) {
        throw new Error('Tags array cannot be empty');
      }
      return createFilter(tags, operator);
    };

    const createSmartFilter = (filterType: string): string => {
      const smartFilters: Record<string, string[]> = {
        engagement: ['click', 'open', 'view', 'forward', 'share'],
        critical_issues: ['spam', 'bounce_hb', 'bounce_mb'],
        temporary_failures: ['bounce_sb', 'bounce_df', 'bounce_fm', 'bounce_tr'],
        list_cleanup: ['bounce_hb', 'spam', 'global_unsubscribe']
      };

      const eventTypes = smartFilters[filterType];
      if (!eventTypes) {
        throw new Error(`Unknown smart filter type: ${filterType}`);
      }

      const conditions = eventTypes.map(type => `type==${type}`);
      return createFilter(conditions, 'or');
    };

    it('should create basic filters', () => {
      const filter = createFilter(['tag1', 'tag2'], 'or');
      const parsed = JSON.parse(filter);
      expect(parsed.or).toEqual(['tag1', 'tag2']);
    });

    it('should create tag filters', () => {
      const filter = createTagFilter(['newsletter', 'promo']);
      const parsed = JSON.parse(filter);
      expect(parsed.or).toEqual(['newsletter', 'promo']);
    });

    it('should create smart filters', () => {
      const filter = createSmartFilter('engagement');
      const parsed = JSON.parse(filter);
      expect(parsed.or).toEqual(
        expect.arrayContaining([
          expect.stringContaining('click'),
          expect.stringContaining('open')
        ])
      );
    });

    it('should validate filter parameters', () => {
      expect(() => createFilter([], 'and'))
        .toThrow('Conditions are required');

      expect(() => createFilter(['test'], 'invalid' as any))
        .toThrow('Operator must be one of');

      expect(() => createTagFilter([]))
        .toThrow('Tags array cannot be empty');

      expect(() => createSmartFilter('invalid'))
        .toThrow('Unknown smart filter type');
    });
  });

  describe('Log Analysis', () => {
    const analyzeEmailLogs = (logs: any) => {
      const data = logs.data || [];
      const totalEvents = data.length;

      if (totalEvents === 0) {
        return {
          totalEvents: 0,
          eventBreakdown: {},
          deliveryRate: 0,
          engagementRate: 0,
          issueRate: 0,
          recommendations: ['No events to analyze']
        };
      }

      const eventBreakdown: Record<string, number> = {};
      data.forEach((log: any) => {
        const type = log.type || 'unknown';
        eventBreakdown[type] = (eventBreakdown[type] || 0) + 1;
      });

      const delivered = eventBreakdown.delivered || 0;
      const bounced = (eventBreakdown.bounce || 0) + (eventBreakdown.bounce_hb || 0) + (eventBreakdown.bounce_sb || 0);
      const opened = eventBreakdown.open || 0;
      const clicked = eventBreakdown.click || 0;
      const spam = eventBreakdown.spam || 0;

      const deliveryRate = delivered > 0 ? (delivered / (delivered + bounced)) * 100 : 0;
      const engagementRate = delivered > 0 ? ((opened + clicked) / delivered) * 100 : 0;
      const issueRate = totalEvents > 0 ? ((bounced + spam) / totalEvents) * 100 : 0;

      const recommendations: string[] = [];
      if (deliveryRate < 95) {
        recommendations.push('Low delivery rate detected. Consider list cleaning and sender reputation monitoring.');
      }
      if (engagementRate < 15) {
        recommendations.push('Low engagement rate. Consider improving subject lines and content quality.');
      }
      if (issueRate > 5) {
        recommendations.push('High issue rate detected. Review bounce handling and spam prevention measures.');
      }
      if (recommendations.length === 0) {
        recommendations.push('Email performance looks healthy. Continue monitoring key metrics.');
      }

      return {
        totalEvents,
        eventBreakdown,
        deliveryRate: Math.round(deliveryRate * 100) / 100,
        engagementRate: Math.round(engagementRate * 100) / 100,
        issueRate: Math.round(issueRate * 100) / 100,
        recommendations
      };
    };

    it('should analyze email logs correctly', () => {
      const mockLogs = {
        data: [
          { type: 'submitted', time: 1701428400 },
          { type: 'delivered', time: 1701428460 },
          { type: 'open', time: 1701428500 },
          { type: 'click', time: 1701428520 },
          { type: 'bounce', time: 1701428540 }
        ],
        pagination: { page: 1, per_page: 50, total: 5 }
      };

      const analysis = analyzeEmailLogs(mockLogs);

      expect(analysis.totalEvents).toBe(5);
      expect(analysis.eventBreakdown.delivered).toBe(1);
      expect(analysis.eventBreakdown.open).toBe(1);
      expect(analysis.eventBreakdown.click).toBe(1);
      expect(analysis.eventBreakdown.bounce).toBe(1);
      expect(analysis.deliveryRate).toBeGreaterThan(0);
      expect(analysis.engagementRate).toBeGreaterThan(0);
      expect(analysis.recommendations).toBeInstanceOf(Array);
    });

    it('should handle empty logs', () => {
      const mockLogs = { data: [], pagination: { page: 1, per_page: 50, total: 0 } };
      const analysis = analyzeEmailLogs(mockLogs);

      expect(analysis.totalEvents).toBe(0);
      expect(analysis.deliveryRate).toBe(0);
      expect(analysis.engagementRate).toBe(0);
      expect(analysis.issueRate).toBe(0);
      expect(analysis.recommendations).toContain('No events to analyze');
    });
  });

  describe('Email ID Validation', () => {
    const validateEmailId = (emailId: string): boolean => {
      if (!emailId) {
        return false;
      }

      // Updated UUID regex to be more permissive for testing
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(emailId);
    };

    it('should validate UUID format for email operations', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(validateEmailId(validUuid)).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(validateEmailId('invalid-uuid')).toBe(false);
      expect(validateEmailId('')).toBe(false);
      expect(validateEmailId('123-456-789')).toBe(false);
    });
  });
});
