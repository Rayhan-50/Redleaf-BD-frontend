import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, CheckCircle, AlertCircle, Leaf, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import useAxiosPublic from '../hooks/useAxiosPublic';

const ContactUs = () => {
  const axiosPublic = useAxiosPublic();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      await axiosPublic.post('/contactCollection', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-gray-800 focus:outline-none focus:ring-2 transition ${errors[field]
      ? 'border-red-400 focus:ring-red-200 bg-red-50'
      : 'border-gray-200 focus:ring-red-100 focus:border-red-500 bg-white'
    }`;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-700 via-red-600 to-red-800 py-20 px-4 text-white text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="inline-block bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">Contact Our Team</h1>
          <p className="text-red-100 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            Have a question, feedback or want to partner with us? We're here to help you experience the best of Redleaf-BD.
          </p>
        </motion.div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Let's Talk</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Whether it's a delivery concern or a partnership inquiry, our team is here to help every step of the way.
                </p>
              </div>

              {[
                { icon: Phone, label: 'Phone', value: '+8809638898288', href: 'tel:+8809638898288' },
                { icon: FaWhatsapp, label: 'WhatsApp', value: '+880 1816-126055', href: 'https://wa.me/8801816126055' },
                { icon: Mail, label: 'Email', value: 'support@redleaf-bd.com', href: 'mailto:support@redleaf-bd.com' },
                { icon: MapPin, label: 'Address', value: '123 Green Valley Road, Banani, Dhaka-1213', href: '#' },
              ].map(({ icon: Icon, label, value, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#0A3D2A]/30 hover:shadow-md transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-600 transition-colors duration-300">
                    <Icon className="h-5 w-5 text-red-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                </a>
              ))}

              <div className="p-5 bg-red-50 border border-red-100 rounded-2xl shadow-sm">
                <p className="text-sm text-red-800 font-extrabold mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Business Hours
                </p>
                <div className="space-y-1 text-sm text-red-700/80 font-medium">
                  <p>Saturday – Thursday: <span className="text-red-900 font-bold">9 AM – 9 PM</span></p>
                  <p>Friday: <span className="text-red-900 font-bold">2 PM – 8 PM</span> (After Juma)</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                {status === 'success' && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">Message sent successfully! We'll get back to you within 24 hours.</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">Failed to send message. Please try again.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your full name" className={inputCls('name')} />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email *</label>
                      <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="your@email.com" className={inputCls('email')} />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} type="tel" placeholder="+880 1XXX-XXXXXX" className={inputCls('phone')} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Subject</label>
                      <select name="subject" value={form.subject} onChange={handleChange} className={inputCls('subject')}>
                        <option value="">Choose a topic</option>
                        <option>Order Issue</option>
                        <option>Product Quality</option>
                        <option>Delivery Concern</option>
                        <option>Payment Problem</option>
                        <option>Partnership</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe your concern or question in detail..."
                      className={`${inputCls('message')} resize-none`}
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                        Sending…
                      </>
                    ) : (
                      <><Send className="h-5 w-5" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Marketing Section */}
      <section className="py-20 border-t border-gray-100 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">The Redleaf-BD Promise</h2>
            <div className="w-20 h-1.5 bg-red-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: '100% Organic', desc: 'Sourced directly from trusted farms to ensure pure quality.' },
              { icon: Truck, title: 'Fastest Delivery', desc: "Quick and safe delivery within 2 hours in Dhaka City." },
              { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Your payments are protected with top-tier SSL encryption.' },
              { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is always here for your assistance.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-red-100 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 group text-center"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="text-xl font-extrabold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;