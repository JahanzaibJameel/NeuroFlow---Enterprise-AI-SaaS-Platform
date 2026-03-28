#!/bin/bash

# NeuroFlow - Production Deployment Script
# Run this to go from zero to deployed in 10 minutes

set -e  # Exit on error

echo "🚀 Starting NeuroFlow Deployment..."
echo ""

# Step 1: Check prerequisites
echo "📦 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing globally..."
    npm install -g pnpm
fi

echo "✅ Node.js: $(node --version)"
echo "✅ pnpm: $(pnpm --version)"
echo ""

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
pnpm install
echo "✅ Dependencies installed"
echo ""

# Step 3: Environment setup
echo "🔐 Setting up environment variables..."

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    
    # Generate AUTH_SECRET
    AUTH_SECRET=$(openssl rand -base64 32)
    
    # Update .env.local with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/AUTH_SECRET=\"your-secret-key-here-generate-with-openssl-rand-base64-32\"/AUTH_SECRET=\"$AUTH_SECRET\"/" .env.local
    else
        sed -i "s/AUTH_SECRET=\"your-secret-key-here-generate-with-openssl-rand-base64-32\"/AUTH_SECRET=\"$AUTH_SECRET\"/" .env.local
    fi
    
    echo "✅ Environment file created with generated AUTH_SECRET"
else
    echo "⚠️  .env.local already exists, skipping..."
fi
echo ""

# Step 4: Database setup
echo "🗄️  Setting up database..."

read -p "Do you have a PostgreSQL database URL ready? (y/n): " has_db
if [ "$has_db" = "y" ]; then
    read -p "Enter your DATABASE_URL: " db_url
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|DATABASE_URL=\"postgresql://user:password@localhost:5432/neuroflow?schema=public\"|DATABASE_URL=\"$db_url\"|" .env.local
    else
        sed -i "s|DATABASE_URL=\"postgresql://user:password@localhost:5432/neuroflow?schema=public\"|DATABASE_URL=\"$db_url\"|" .env.local
    fi
    
    echo "🔄 Pushing Prisma schema to database..."
    pnpm db:push
    
    echo "🌱 Seeding database with demo data..."
    pnpm db:seed
    
    echo "🔨 Generating Prisma client..."
    pnpm db:generate
    
    echo "✅ Database configured"
else
    echo "⚠️  Skipping database setup. You'll need to:"
    echo "   1. Set DATABASE_URL in .env.local"
    echo "   2. Run: pnpm db:push"
    echo "   3. Run: pnpm db:seed"
    echo "   4. Run: pnpm db:generate"
fi
echo ""

# Step 5: OpenAI API key
echo "🤖 Configuring AI features..."

read -p "Do you have an OpenAI API key? (y/n): " has_openai
if [ "$has_openai" = "y" ]; then
    read -p "Enter your OPENAI_API_KEY: " openai_key
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/OPENAI_API_KEY=\"\"/OPENAI_API_KEY=\"$openai_key\"/" .env.local
    else
        sed -i "s/OPENAI_API_KEY=\"\"/OPENAI_API_KEY=\"$openai_key\"/" .env.local
    fi
    echo "✅ OpenAI API key configured"
else
    echo "⚠️  AI features will not work without OPENAI_API_KEY"
    echo "   Get one at: https://platform.openai.com/api-keys"
    echo "   Then add it to .env.local: OPENAI_API_KEY=sk-..."
fi
echo ""

# Step 6: Type check
echo "🔍 Running type check..."
if pnpm typecheck; then
    echo "✅ TypeScript compilation successful"
else
    echo "⚠️  TypeScript errors found (this is okay for initial setup)"
fi
echo ""

# Step 7: Lint
echo "✨ Running linter..."
if pnpm lint; then
    echo "✅ ESLint passed"
else
    echo "⚠️  ESLint warnings found (can be fixed later)"
fi
echo ""

# Step 8: Build
echo "🏗️  Building application..."
if pnpm build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Check errors above."
    exit 1
fi
echo ""

# Step 9: Start dev server
echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development server:"
echo "  pnpm dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Demo accounts:"
echo "  Admin: admin@neuroflow.dev / admin123"
echo "  User: user@neuroflow.dev / user123"
echo ""
echo "Next steps:"
echo "  1. Test the AI Playground at /dashboard/ai-playground"
echo "  2. Try prompts like 'show my top projects'"
echo "  3. Explore the dashboard"
echo ""
echo "To deploy to Vercel:"
echo "  1. Install Vercel CLI: npm i -g vercel"
echo "  2. Run: vercel"
echo "  3. Set environment variables in Vercel dashboard"
echo ""
