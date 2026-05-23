#!/bin/bash

# WebPilot SaaS - Database Initialization Script
# This script initializes the Aurora PostgreSQL database with required schema

echo "🚀 Starting database initialization..."
echo ""

# Check if running locally or on production
if [ -f ".env.local" ]; then
    source .env.local
    BASE_URL="http://localhost:3000"
    echo "📍 Local environment detected"
else
    BASE_URL="${NEXTAUTH_URL:-https://localhost:3000}"
    echo "📍 Production environment detected"
fi

echo "🔗 Connecting to: $BASE_URL"
echo ""

# Call the initialization endpoint
echo "📝 Running migrations..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/db/init")

# Parse response
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

echo ""
echo "Response Status: $HTTP_CODE"
echo "Response Body:"
echo "$BODY" | jq . 2>/dev/null || echo "$BODY"

if [ "$HTTP_CODE" = "200" ]; then
    echo ""
    echo "✅ Database initialization successful!"
    echo ""
    echo "✨ Your database is now ready!"
    echo "You can now sign up at: $BASE_URL/auth/signup"
    exit 0
elif [ "$HTTP_CODE" = "207" ]; then
    echo ""
    echo "⚠️  Partial success - some tables created"
    echo "Please check the response above for details"
    exit 1
else
    echo ""
    echo "❌ Database initialization failed"
    echo "HTTP Status: $HTTP_CODE"
    exit 1
fi
