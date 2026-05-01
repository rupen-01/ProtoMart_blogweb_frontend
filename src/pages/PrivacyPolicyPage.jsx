import LegalPageLayout from "../components/common/LegalPageLayout";

const PrivacyPolicyPage = () => {
  return (
    <LegalPageLayout
      eyebrow="Privacy"
      title="Privacy Policy"
      description="This Privacy Policy explains how Travel Pics collects, uses, stores, and shares information when you use our travel platform."
      lastUpdated="May 1, 2026"
    >
      <h2>Introduction</h2>
      <p>
        Travel Pics is a travel platform where users can explore destinations,
        upload photos, publish travel stories, comment on posts, and interact with
        map-based location content. By using our platform, you agree to the practices
        described in this Privacy Policy.
      </p>

      <h2>Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li>Personal data such as your name, email address, username, and account details.</li>
        <li>Uploaded content including photos, blog posts, captions, comments, and profile information.</li>
        <li>Location data you provide or associate with places, photos, posts, or map activity.</li>
        <li>Usage data such as pages visited, actions taken, device information, browser type, IP address, and referral sources.</li>
        <li>Communication data when you contact us, request support, or respond to surveys or announcements.</li>
      </ul>

      <h2>How We Use the Information</h2>
      <p>We use collected information to operate, improve, and protect the platform, including to:</p>
      <ul>
        <li>Create and manage user accounts.</li>
        <li>Display uploaded photos, blog content, comments, and location-based content.</li>
        <li>Provide interactive map, discovery, and community features.</li>
        <li>Personalize user experience and improve website performance.</li>
        <li>Monitor usage, troubleshoot issues, and prevent abuse or fraud.</li>
        <li>Send service-related messages, updates, and important notices.</li>
        <li>Comply with legal obligations and enforce our platform policies.</li>
      </ul>

      <h2>Data Sharing Policy</h2>
      <p>We do not sell your personal information. We may share information in limited cases such as:</p>
      <ul>
        <li>With service providers that support hosting, storage, analytics, authentication, email delivery, and infrastructure.</li>
        <li>With analytics and performance tools that help us understand traffic and usage patterns.</li>
        <li>When content is publicly posted by you, such as blog posts, comments, location details, and public photos.</li>
        <li>When required by law, regulation, legal process, or to protect rights, safety, and platform security.</li>
        <li>As part of a business transfer such as a merger, acquisition, financing, or sale of assets.</li>
      </ul>

      <h2>Cookies and Tracking Technologies</h2>
      <p>
        We may use cookies, local storage, pixels, and similar tracking technologies to
        keep you signed in, remember preferences, analyze usage, improve performance,
        and support core website features. You can manage cookie settings through your
        browser, but disabling some cookies may affect how the platform works.
      </p>

      <h2>User Rights</h2>
      <p>Depending on your location, you may have rights to:</p>
      <ul>
        <li>Access the personal information we hold about you.</li>
        <li>Update or correct account information.</li>
        <li>Request deletion of your account or certain personal data.</li>
        <li>Request removal of uploaded content, subject to legal or operational requirements.</li>
        <li>Object to or limit certain processing where applicable.</li>
      </ul>
      <p>
        To make a privacy request, contact us at info@travelphotos.com. We may need to verify
        your identity before completing your request.
      </p>

      <h2>Data Security</h2>
      <p>
        We use reasonable administrative, technical, and organizational measures to help
        protect your information. However, no method of transmission or storage is
        completely secure, and we cannot guarantee absolute security.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Travel Pics is not intended for children under 13, or under the minimum
        age required by local law. We do not knowingly collect personal information from
        children without appropriate authorization. If you believe a child has provided
        personal information, please contact us so we can review and remove it if needed.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes to our
        services, legal requirements, or business practices. When we make material
        changes, we will update the effective date and may provide additional notice
        through the website or by email when appropriate.
      </p>

      <h2>Contact Information</h2>
      <p>If you have questions about this Privacy Policy or our privacy practices, contact us at:</p>
      <ul>
        <li>Travel Pics</li>
        <li>info@travelphotos.com</li>
      </ul>
    </LegalPageLayout>
  );
};

export default PrivacyPolicyPage;
