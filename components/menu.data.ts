interface IMenu {
    label:string,
    icon:string
}

export const items = ref<IMenu[]>([
    {
        label: 'Главная',
        icon: 'pi pi-home'
    },
    {
        label: 'Передать показания',
        icon: 'pi pi-star'
    },   
    {
        label: 'Список',
        icon: 'pi pi-envelope'
      
    }
]);