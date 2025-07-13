import EmailAPITestComponent from '../../components/EmailAPITestComponent';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function TestEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Email System
          </h1>
          <p className="text-gray-600">
            Test the server-side email notification system
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Email System Status
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-blue-800 font-medium">Server-side API Route Active</p>
                  <p className="text-blue-600 text-sm">
                    All emails are sent securely through the server-side API route at /api/email
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Environment Check
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Required Variables</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• RESEND_API_KEY</li>
                  <li>• FROM_EMAIL</li>
                  <li>• ADMIN_EMAIL</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Email Types</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Appointment Confirmation</li>
                  <li>• Appointment Reminder</li>
                  <li>• Appointment Cancellation</li>
                  <li>• Order Confirmation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Admin Notifications
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-green-800 font-medium">Automatic Admin Notifications</p>
                  <p className="text-green-600 text-sm">
                    All customer emails automatically send notifications to the admin email address.
                    No additional function calls needed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <EmailAPITestComponent />
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="w-5 h-5 bg-yellow-500 rounded-full mr-3 mt-0.5"></div>
            <div>
              <h3 className="text-yellow-800 font-medium mb-2">Testing Notes</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Make sure your environment variables are properly configured</li>
                <li>• Check the browser console and server logs for any errors</li>
                <li>• Verify that emails are received at both customer and admin addresses</li>
                <li>• This page is for development testing only - remove in production</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 