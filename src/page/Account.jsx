import { Outlet, Link, useLocation } from 'react-router-dom'
import { FiShoppingBag, FiCreditCard, FiMapPin, FiSettings } from 'react-icons/fi'
import SlidbarProfile from '../components/assets/SlidbarProfile'
import { useLanguage } from '../components/hook/LanguageContext'

const mobileTabs = [
  { labelKey: 'my_orders', icon: <FiShoppingBag />, to: '/account' },
  { labelKey: 'wallet', icon: <FiCreditCard />, to: '/account/wallets' },
  { labelKey: 'addresses', icon: <FiMapPin />, to: '/account/address' },
  { labelKey: 'account_detail', icon: <FiSettings />, to: '/account/detail' },
]

function MobileProfileTabs() {
  const { t } = useLanguage()
  const { pathname } = useLocation()

  const isActive = (to) => {
    if (to === '/account') {
      return pathname === '/account' || pathname.startsWith('/account/orderplace')
    }
    return pathname.startsWith(to)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 pt-6 md:hidden">
      {mobileTabs.map((tab, index) => {
        const active = isActive(tab.to)
        return (
          <Link
            key={index}
            to={tab.to}
            className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-colors ${
              active ? 'bg-orange-600 text-white shadow-md shadow-orange-200' : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{t(tab.labelKey)}</span>
          </Link>
        )
      })}
    </div>
  )
}

function Account() {
  return (
    <div className="max-w-6xl mx-auto flex gap-6 lg:gap-10 px-4 sm:px-6 lg:px-8 font-semibold">
      <div className=" hidden md:block flex-shrink-0">
        <div className="sticky top-0 h-screen pt-10">
          <SlidbarProfile />
        </div>
      </div>
      <div className=" flex-1 min-w-0">
        <MobileProfileTabs />
        <Outlet />
      </div>
    </div>
  )
}

export default Account