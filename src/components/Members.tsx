"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function Members() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-24 px-4 md:px-16 max-w-7xl mx-auto" id="members">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-[50px] md:text-[80px] leading-[0.85] font-black tracking-tighter uppercase mb-4">
             THE <br/><span className="text-transparent" style={{ WebkitTextStroke: '1px #F5F5F5' }}>ARCHITECTS</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-light text-white/50 mt-4">
            The minds behind the velocity.
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Member 1 */}
        <div className="group relative overflow-hidden aspect-[3/4] bg-[#111] border border-white/5 hover:border-white/20">
          <img className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="Arjun Mehta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6LDZfPq1cAK4Bkk4ifjxv46zOJR-MqcLlXk7YYC7E9FOIXX4a4s-W-__PVcvGIsx7faL3dJH9WOovnNwp32zrewgnftHJo73SDxsFigPZ0LKUxA3V2TRZlh47mG4qN49ldi98musaECgXd-qj5uZbk9b0EC7PBbCD4DKR7lVvxw-8cgnxdMtwvxOS6QEmsHHcneCsjIyYy8Rjnq3kZBCgMid4y-8LCVdNwt6VrViJvU-ayduxAmITjIc_Ov6JodmYF1MnHoAOlrY" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <p className="text-[10px] uppercase tracking-widest text-[#FF3E00] font-bold mb-2">TEAM CAPTAIN</p>
            <h4 className="text-xl font-bold uppercase tracking-wider">Arjun Mehta</h4>
          </div>
        </div>
        {/* Member 2 */}
        <div className="group relative overflow-hidden aspect-[3/4] bg-[#111] border border-white/5 hover:border-white/20">
          <img className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="Sanya Verma" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0QUoqWNH2gKOaCNfOkKzdwOElPvNsb0iJfm37FDyJ6YupoHOjA8_9KWuqVzDsdgAaoHkRIDZ5fZxg45UewE8qnRCjL4hpmg6Kc-W0Lcr3VW9My-HEdPooQnigEt27Yzu0v04WnbfK-mnDsV16ANKR9OwV5sC9jQmg_AQLVp33CKwgKfdc7T5Qu-l2rEqby3q19UYTp5cFAARra1KiT2VrQz_-WStzuP_YP0odpXzdRnGuPsF4eur3GORzdMkKE2rkLIQBOogiq1s" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <p className="text-[10px] uppercase tracking-widest text-inverse-primary font-bold mb-2">AERO LEAD</p>
            <h4 className="text-xl font-bold uppercase tracking-wider">Sanya Verma</h4>
          </div>
        </div>
        {/* Member 3 */}
        <div className="group relative overflow-hidden aspect-[3/4] bg-[#111] border border-white/5 hover:border-white/20">
          <img className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="Rohan Gupta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMkLjnPNLGEi-3nggxv09Y_Zlz0tarJ9Lfot9co7o6ZNiGe32d51OtJUwvK6Z-TDNL93-Fj8AdLcE4yD8SO5ZM5xoJx0oICmCFxsCPEU2Sb1sxl3oaBELh5zFU7Y5D7bpMaEdjHk1LeHCX0ap-OG3kqo5E-t_ql2Dw33Ra2muD4zHBi8F8dguKzIh40XhCBgZPlsR9faAEOb8QrQ4UgQ7ui0Wdz9P6OGEPQgW5DebKGI3ocXWcGPoqO8-VXwKjU5sAci8Y4qgDZAA" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <p className="text-[10px] uppercase tracking-widest text-[#FF3E00] font-bold mb-2">POWERTRAIN LEAD</p>
            <h4 className="text-xl font-bold uppercase tracking-wider">Rohan Gupta</h4>
          </div>
        </div>
        {/* Member 4 */}
        <div className="group relative overflow-hidden aspect-[3/4] bg-[#111] border border-white/5 hover:border-white/20">
          <img className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="Anjali Rao" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmJOTw894JBYLl51eouib_R7WJBPbLIhIBf6eCBnUSPKQDQfkziMBdBrPmtoX1jRAH6PuFSjAypSg5aNedAruV2-2ji45MQpBdsjTvMqGb0qhvw5oPz3KkeBbW2iMVvjBVljiINbxjLBoDb2zJUGwS3XQ5p6YHdtlwmpeFNKIrFFTlyQUMeGgjm6zXw_VVZFwN0pojV0Bz7QDCg3Tu5RQnnuR20B2exwFZ1npY44An5fJa50pgojWrqC9JoK8JvpozGQi0NujRFDk" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <p className="text-[10px] uppercase tracking-widest text-[#FF3E00] font-bold mb-2">CHASSIS LEAD</p>
            <h4 className="text-xl font-bold uppercase tracking-wider">Anjali Rao</h4>
          </div>
        </div>
      </div>
      <div className="mt-16 text-center">
        <a href="/members" className="inline-block bg-[#111] border border-white/20 text-white px-8 py-4 text-[10px] font-bold hover:bg-[#FF3E00] hover:border-[#FF3E00] transition-colors uppercase tracking-widest cursor-pointer">
          VIEW FULL ROSTER
        </a>
      </div>
    </motion.section>
  );
}

