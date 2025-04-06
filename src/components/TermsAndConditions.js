import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const TermsAndConditions = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Terms and Conditions
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Last Updated: March 22, 2025
                </Typography>
            </Box>

            <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                    1. Introduction
                </Typography>
                <Typography paragraph>
                    Welcome to **CricketPro** ("we," "our," "us"). These Terms and Conditions govern your use of the CricketPro application and its services. By accessing or using our application, you agree to comply with and be bound by these terms. If you do not agree with these terms, please do not use our application.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    2. Eligibility
                </Typography>
                <Typography paragraph>
                    You must be at least **13 years old** to use CricketPro. By using this application, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these terms. If you are under 18, you must have parental or guardian consent to use this application.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    3. User Accounts
                </Typography>
                <Typography paragraph>
                    To access features like match predictions, team data, and chat, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    4. Prohibited Activities
                </Typography>
                <Typography paragraph>
                    You agree not to:
                    <ul>
                        <li>Use CricketPro for any illegal or unauthorized purpose, including match-fixing or gambling.</li>
                        <li>Violate any laws, regulations, or third-party rights, including intellectual property rights.</li>
                        <li>Attempt to gain unauthorized access to the application, its systems, or other users' accounts.</li>
                        <li>Engage in any activity that disrupts or interferes with the application's functionality, such as spamming or distributing malware.</li>
                        <li>Post or share harmful, abusive, or offensive content in the chat or any other public areas of the app.</li>
                    </ul>
                </Typography>

                <Typography variant="h6" gutterBottom>
                    5. Intellectual Property
                </Typography>
                <Typography paragraph>
                    All content, trademarks, logos, and intellectual property on CricketPro, including but not limited to match data, player statistics, and app design, are owned by or licensed to us. You may not use, reproduce, or distribute any content from the application without our prior written permission.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    6. Limitation of Liability
                </Typography>
                <Typography paragraph>
                    To the fullest extent permitted by law, CricketPro shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the application. This includes, but is not limited to, loss of data, profits, or business opportunities. We do not guarantee the accuracy of match predictions or live scores.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    7. Termination
                </Typography>
                <Typography paragraph>
                    We reserve the right to suspend or terminate your access to CricketPro at any time, without notice, for any reason, including but not limited to a violation of these terms. Upon termination, your right to use the application will immediately cease.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    8. Changes to Terms
                </Typography>
                <Typography paragraph>
                    We may update these Terms and Conditions from time to time. Any changes will be posted on this page, and your continued use of CricketPro after such changes constitutes your acceptance of the updated terms. We encourage you to review this page periodically.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    9. Governing Law
                </Typography>
                <Typography paragraph>
                    These Terms and Conditions are governed by and construed in accordance with the laws of **India**. Any disputes arising from these terms shall be resolved exclusively in the courts of **Mumbai, India**.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    10. Contact Us
                </Typography>
                <Typography paragraph>
                    If you have any questions about these Terms and Conditions, please contact us at **support@cricketpro.com**.
                </Typography>
            </Box>
        </Container>
    );
};

export default TermsAndConditions;