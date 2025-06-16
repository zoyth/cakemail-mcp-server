# Cakemail MCP Server - Smart Event Filtering Guide

## Overview

The Cakemail MCP Server has been enhanced with intelligent event categorization and smart filtering capabilities. This guide explains how to use the new features to efficiently analyze campaign logs and identify important events.

## Event Taxonomy

### Event Categories

**ENGAGEMENT** - User interactions (high priority for performance analysis)
- `click` / `clickthru` - Link clicks (consolidate to 'click')
- `open` - Email opens
- `view` - Email views (may differ from opens)
- `forward` - Email forwards
- `share` - Social/other sharing

**BOUNCES** - Delivery failures (critical for list maintenance)
- `bounce_hb` - Hard Bounce (permanent failure - remove from list)
- `bounce_sb` - Soft Bounce (temporary - retry possible)
- `bounce_mb` - Email Blocked (reputation issue)
- `bounce_df` - DNS Failure (temporary DNS problem)
- `bounce_fm` - Mailbox Full (temporary - recipient's mailbox full)
- `bounce_tr` - Transient Bounce (system still trying)
- `bounce_cr` - Challenge/Response (anti-spam verification needed)
- `bounce_ac` - Address Change (recipient moved)
- `bounce_ar` - Auto Reply (out-of-office, not a true bounce)

**LIST_MANAGEMENT** - Subscription changes (track growth/churn)
- `subscribe` - User opted in
- `unsubscribe` - User opted out of specific list
- `global_unsubscribe` - User opted out of all communications
- `unsub_reason` - Reason code for unsubscribe

**DELIVERABILITY_ISSUES** - Reputation threats (immediate attention needed)
- `spam` - Spam complaint (damages sender reputation)
- `auto_responder` - Automated system response

**DELIVERY_PIPELINE** - Processing status (system monitoring)
- `generating` - Content being generated
- `in_queue` - Waiting in delivery queue
- `schedule` - Scheduled for future delivery
- `sent` - Successfully sent
- `received` - Delivery confirmed
- `skipped` - Delivery skipped (suppression, etc.)

**ADMINISTRATIVE** - System events (low priority)
- `update` - Record/preference updates
- `other` - Miscellaneous events

## Smart Filter Examples

### Basic Usage
```
# Get campaign logs with smart analysis
cakemail_get_campaign_logs({
  "campaign_id": "12345",
  "per_page": 50
})
```

### Engagement Analysis
```
# Track user interactions (clicks, opens, views)
cakemail_get_campaign_logs({
  "campaign_id": "12345", 
  "filter": "type==click;type==open;type==view"
})
```

### Critical Issues Monitoring
```
# Find issues requiring immediate attention
cakemail_get_campaign_logs({
  "campaign_id": "12345",
  "filter": "type==spam;type==bounce_hb;type==bounce_mb"
})
```

### List Cleanup Analysis
```
# Identify addresses to remove from lists
cakemail_get_campaign_logs({
  "campaign_id": "12345",
  "filter": "type==bounce_hb;type==spam;type==global_unsubscribe"
})
```

### Temporary Failures Monitoring
```
# Track retryable delivery issues
cakemail_get_campaign_logs({
  "campaign_id": "12345",
  "filter": "type==bounce_sb;type==bounce_df;type==bounce_fm;type==bounce_tr"
})
```

### Delivery Pipeline Tracking
```
# Monitor email processing status
cakemail_get_campaign_logs({
  "campaign_id": "12345",
  "filter": "type==generating;type==in_queue;type==sent;type==received"
})
```

### Time-based Analysis
```
# Recent engagement events
cakemail_get_campaign_logs({
  "campaign_id": "12345",
  "filter": "type==click;type==open",
  "start_time": 1640995200,  # Last 24 hours
  "end_time": 1641081600
})
```

## Smart Analysis Features

The enhanced logs API now provides:

### Automatic Categorization
- Events are automatically categorized by type
- Critical events are flagged for attention
- Engagement and issue rates are calculated

### Event Severity Classification
- **Critical**: Immediate attention needed (spam, hard bounces, blocks)
- **Warning**: Monitor closely (soft bounces, DNS issues)
- **Info**: Normal operations (opens, clicks, delivery status)

### Actionable Insights
- **List Cleanup**: Identifies permanent failures requiring removal
- **Reputation Monitoring**: Tracks spam complaints and blocks
- **Engagement Metrics**: Calculates interaction rates
- **Delivery Health**: Monitors temporary vs. permanent issues

## Pre-built Filter Helpers

The system includes pre-built filters for common use cases:

- `engagement_events` - All user interactions
- `delivery_issues` - Critical delivery problems
- `temporary_failures` - Retryable failures
- `list_changes` - Subscription activities
- `reputation_threats` - Events damaging sender reputation
- `delivery_pipeline` - Processing status events
- `clicks_only` - Click events only
- `opens_only` - Open events only
- `all_bounces` - All bounce types
- `critical_events` - Events needing immediate attention

## Best Practices

### For Campaign Performance Analysis
1. Start with engagement filters to measure success
2. Check critical issues for immediate problems
3. Analyze temporary failures for delivery optimization
4. Monitor list management events for growth trends

### For List Maintenance
1. Use list cleanup filters to identify removal candidates
2. Separate permanent from temporary failures
3. Track unsubscribe patterns and reasons
4. Monitor address changes for list updates

### For Reputation Management
1. Watch for spam complaints and blocks
2. Monitor hard bounce rates
3. Track delivery success rates
4. Identify problematic recipient domains

### For Troubleshooting
1. Check delivery pipeline for processing issues
2. Analyze temporary failures for patterns
3. Review DNS and server problems
4. Monitor auto-responder and challenge responses

## Advanced Usage

### Combining Filters
```
# Multiple event types
"filter": "type==click;type==open;type==bounce_hb"

# With additional parameters
"filter": "type==click;contact_id==12345"

# Email-specific filtering
"filter": "type==open;email==user@example.com"
```

### Time-based Patterns
```
# Peak engagement hours
"start_time": 1641045600,  # 9 AM
"end_time": 1641049200     # 10 AM

# Daily comparison
"start_time": 1640995200,  # Yesterday
"end_time": 1641081600     # Today
```

This smart filtering system makes it easy to understand email campaign performance, identify issues, and maintain healthy mailing lists while protecting sender reputation.
