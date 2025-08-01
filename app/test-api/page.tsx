'use client'

import { useState } from 'react'

export default function TestAPIPage() {
  const [getResult, setGetResult] = useState<string>('')
  const [postResult, setPostResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testGET = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing GET /api/products...')
      const response = await fetch('/api/products')
      const data = await response.text()
      console.log('📊 GET Response:', response.status, data)
      setGetResult(`Status: ${response.status}\n${data}`)
    } catch (error) {
      console.error('💥 GET Error:', error)
      setGetResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testPOST = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing POST /api/products...')
      const testData = {
        name: `Test Product ${Date.now()}`,
        type: 'Electronics',
        batteryNeeded: false,
        batteryType: null,
        features: ['Test'],
        imageUrl: ''
      }
      console.log('📦 Sending data:', testData)
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      const data = await response.text()
      console.log('📊 POST Response:', response.status, data)
      setPostResult(`Status: ${response.status}\n${data}`)
    } catch (error) {
      console.error('💥 POST Error:', error)
      setPostResult(`Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">API Route Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* GET Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test GET /api/products</h2>
          <button
            onClick={testGET}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test GET'}
          </button>
          {getResult && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {getResult}
            </pre>
          )}
        </div>

        {/* POST Test */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test POST /api/products</h2>
          <button
            onClick={testPOST}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test POST'}
          </button>
          {postResult && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {postResult}
            </pre>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">Debug Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser DevTools (F12)</li>
          <li>Go to Console tab</li>
          <li>Click the test buttons above</li>
          <li>Check both browser console and terminal for logs</li>
          <li>Look for any error messages or missing logs</li>
        </ol>
      </div>
    </div>
  )
} 