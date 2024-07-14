/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Icon as ChakraIcon, IconProps } from '@chakra-ui/icon';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  EditIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import { AiFillBank, AiFillShop, AiOutlineUser } from 'react-icons/ai';
import { BsReceipt } from 'react-icons/bs';
import { FaFileInvoice } from 'react-icons/fa';
import { GiPayMoney, GiReceiveMoney } from 'react-icons/gi';
import { HiOutlineCurrencyDollar, HiShoppingCart } from 'react-icons/hi';
import {
  MdCategory,
  MdOutlineAccountBalanceWallet,
  MdOutlineExitToApp,
  MdOutlinePersonOutline,
  MdOutlineShoppingCart,
  MdPeople,
  MdRestaurant,
  MdSpaceDashboard,
} from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';

interface IconsObject {
  [key: string]: JSX.Element | any; // React component type.
}

const getIcon: IconsObject = {
  payments: GiReceiveMoney,
  outcomes: GiPayMoney,
  'bank-outcomes': AiFillBank,
  sun: SunIcon,
  edit: EditIcon,
  moon: MoonIcon,
  check: CheckIcon,
  close: CloseIcon,
  upIcon: TriangleUpIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  downIcon: TriangleDownIcon,
  hamburgerMenu: HamburgerIcon,
  dropdownMenu: ChevronDownIcon,
  invoice: BsReceipt,
  invoices: FaFileInvoice,
  clients: MdPeople,
  products: AiFillShop,
  orders: HiShoppingCart,
  categories: MdCategory,
  exit: MdOutlineExitToApp,
  restaurants: MdRestaurant,
  cart: MdOutlineShoppingCart,
  dashboard: MdSpaceDashboard,
  password: RiLockPasswordLine,
  person: MdOutlinePersonOutline,
  dollar: HiOutlineCurrencyDollar,
  wallet: MdOutlineAccountBalanceWallet,
  courses: SiCoursera,
  users: AiOutlineUser,
};

interface Props extends IconProps {
  name: string;
}

export const Icon = ({ name, ...config }: Props) => {
  return <ChakraIcon as={getIcon[name]} {...config} />;
};
