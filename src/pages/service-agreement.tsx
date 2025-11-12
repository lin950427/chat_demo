import { useTranslation } from "react-i18next";

export default function ServiceAgreement() {
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en-US';
    return (
        <div className="h-screen bg-white p-4 text-[#333333] overflow-auto">
            <h4 className="text-base font-bold mb-2">{isEn ? 'Service Usage Agreement' : '服务使用协议'}</h4>
            <div className="leading-6 text-sm">
                {isEn ? (
                    <>
                        <p className="mb-2 [text-indent:2em]">Welcome to the "AI Xiaohong" Talent Policy Consultation Service!</p>
                        <p className="mb-2 [text-indent:2em]">This Agreement (hereinafter referred to as "the Agreement") is entered into between you (the "User") and the Hongkou District Talent Service Center (hereinafter referred to as "we," "us," or "the Service Provider") regarding your use of the mobile-based AI Xiaohong Talent Policy Consultation Service (hereinafter referred to as "the Service"). Please read this Agreement carefully and make sure you fully understand all terms, including those that exclude or limit the Service Provider's liability and those that restrict your rights. By clicking "Agree" and proceeding to register or use the Service, you acknowledge that you have read, understood, and accepted all terms of this Agreement. If you do not agree to any of the terms, or are unable to understand them, please do not continue to use the Service.</p>
                        <p className="font-semibold">1. Scope of Service</p>
                        <p className="mb-2 [text-indent:2em]">Through AI Xiaohong, we provide users with convenient access to talent policy consultation services, including but not limited to policy interpretation, application guidance, and answers to frequently asked questions. The Service content may be updated or adjusted from time to time based on policy changes, technical upgrades, or other factors without prior notice to users.</p>
                        <p className="font-semibold">2. User Rights and Obligations</p>
                        <p className="mb-2 [text-indent:2em]">Users have the right to enjoy the services provided under this Agreement and the specific rules of AI Xiaohong. Users must ensure that all information submitted when using the Service is truthful, accurate, complete, lawful, and does not infringe on the rights or interests of any third party. Users must comply with national laws, social ethics, and internet conduct standards, and may not use the Service for any illegal activities.</p>
                        <p className="font-semibold">3. Rights and Obligations of the Service Provider</p>
                        <p className="mb-2 [text-indent:2em]">We will strive to provide stable and reliable services. However, we are not liable for any service interruption or data loss caused by force majeure, third-party actions, hacker attacks, or other non-Service-related reasons. We reserve the right to adjust the Service content, fee standards, and related terms as needed, and will notify users through the AI Xiaohong platform or other appropriate channels. If a user violates this Agreement, we reserve the right to restrict or terminate their access to the Service.</p>
                        <p className="font-semibold">4. Intellectual Property Rights</p>
                        <p className="mb-2 [text-indent:2em]">All content within AI Xiaohong and the Service (including but not limited to text, images, audio, and video) is owned by or licensed to the Service Provider. Users may not use, copy, distribute, transmit, or modify any such content without prior authorization.</p>
                        <p className="font-semibold">5. Disclaimer</p>
                        <p className="mb-2 [text-indent:2em]">We do not guarantee the absolute accuracy or reliability of the Service information. Users should independently determine its suitability for their specific circumstances. We are not liable for any losses resulting from force majeure, system failures, or third-party actions such as hacker attacks.</p>
                        <p className="font-semibold">6. Modification and Termination of the Agreement</p>
                        <p className="mb-2 [text-indent:2em]">This Agreement may be modified or updated periodically. Once published on AI Xiaohong, such modifications shall be deemed effective and notified. Users may stop using the Service at any time but shall bear any consequences arising from such termination. We reserve the right to terminate the Service or this Agreement at our discretion and will notify users in advance through appropriate means.</p>
                        <p className="font-semibold">7. Dispute Resolution</p>
                        <p className="mb-2 [text-indent:2em]">The interpretation, validity, and enforcement of this Agreement shall be governed by the laws of the People's Republic of China. Any disputes arising from or related to this Agreement shall first be resolved through friendly negotiation; if negotiation fails, either party may file a lawsuit with the People's Court where the Service Provider is located.</p>
                    </>
                ) : (
                    <>
                        <p className="[text-indent:2em]">欢迎使用"AI小虹"人才政策咨询服务!</p>
                        <p className="mb-2 [text-indent:2em]">本协议是您(以下简称"用户")与"虹口区政务服务中心"(以下简称"我们"或"服务提供方")之间就您使用"AI小虹"提供的移动端人才政策咨询服务(以下简称"本服务")所订立的法律协议。请务必认真阅读、充分理解本协议中各条款,包括免除或者限制服务提供方责任的条款及对用户的权利限制条款。您一旦点击"同意"并完成注册程序,即表示您已接受本协议的所有内容,并同意受其约束。如果您不同意本协议的任何内容,或者无法准确理解相关条款,请不要进行后续操作。</p>
                        <p className="font-semibold">一、服务内容</p>
                        <p className="mb-2 [text-indent:2em]">我们通过"AI小虹"向用户提供便捷的人才政策咨询问答服务,包括但不限于政策解读、申请指导、常见问题解答等。服务内容可能根据政策变化、技术升级等因素进行不定期更新或调整,我们无需事先通知用户。</p>
                        <p className="font-semibold">二、用户权利与义务</p>
                        <p className="mb-2 [text-indent:2em]">用户有权根据本协议及"AI小虹"的具体规则享受本服务。用户应保证在使用本服务时提交的所有信息真实、准确、完整、合法,不侵犯任何第三方的合法权益。用户应遵守国家法律法规、社会公德及网络道德,不得利用本服务从事任何违法活动。</p>
                        <p className="font-semibold">三、服务提供方的权利与义务</p>
                        <p className="mb-2 [text-indent:2em]">我们承诺将采取合理措施保护用户数据的安全,但不对因不可抗力、黑客攻击等非服务提供方原因导致的用户数据泄露承担责任。我们有权根据业务需要调整服务内容、收费标准等,并提前通过"AI小虹"公告或其他合理方式通知用户。对于用户违反本协议的行为,我们有权采取包括但不限于限制服务、终止服务等措施。</p>
                        <p className="font-semibold">四、知识产权</p>
                        <p className="mb-2 [text-indent:2em]">"AI小虹"及本服务所包含的所有内容(包括但不限于文字、图片、音频、视频等)的知识产权均归服务提供方或其授权方所有,用户未经许可不得擅自使用、复制、传播或修改。</p>
                        <p className="font-semibold">五、免责声明</p>
                        <p className="mb-2 [text-indent:2em]">我们不保证本服务绝对准确无误,用户在使用本服务时应自行判断信息的真实性和适用性。对于因用户自身原因(如误操作、疏忽大意等)或第三方原因(如网络故障、黑客攻击等)导致的损失,我们不承担任何责任。</p>
                        <p className="font-semibold">六、协议变更与终止</p>
                        <p className="mb-2 [text-indent:2em]">本协议内容可能随时变更,变更后的协议将在"AI小虹"上公布,一经公布即视为已通知用户。用户可随时停止使用本服务,并自行承担因此产生的一切后果。我们有权在认为必要时终止本服务或本协议,届时将提前通过合理方式通知用户。</p>
                        <p className="font-semibold">七、争议解决</p>
                        <p className="mb-2 [text-indent:2em]">本协议的解释、效力及争议解决均适用中华人民共和国法律。因本协议引起的或与本协议有关的任何争议,双方应首先通过友好协商解决;协商不成时,任何一方均可向服务提供方所在地人民法院提起诉讼。</p>
                    </>
                )}
            </div>
        </div>
    );
}
