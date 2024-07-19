interface IMenu {
    label:string,
    icon: string,
    link: string,
    role: 'user' | 'admin' | 'all'
}

export const items = ref<IMenu[]>([
    {
        label: 'Главная',
        icon: 'pi pi-home',
        link: '/',
        role: 'all'
    },
    {
        label: 'Общий счетчик',
        icon: 'pi pi-box',
        link: '/total-counter',
         role: 'all'
    },
        {
        label: 'Общие показания',
        icon: 'pi pi-list',
        link: '/all-readings',
        role: 'all'
    }
]);