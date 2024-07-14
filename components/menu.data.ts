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
        icon: 'pi pi-star',
        link: '/total-counter',
         role: 'all'
    },
        {
        label: 'Список',
        icon: 'pi pi-star',
        link: '/all-readings',
        role: 'all'
    }
]);